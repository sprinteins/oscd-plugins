import { Project } from 'ts-morph'
// TYPES
import type {
	ModuleDeclaration,
	SourceFile,
	Symbol as TSMorphSymbol
} from 'ts-morph'

const mappedTypesResult: {
	[key: string]: {
		tag: string
		anyAllowed: {
			attributes: boolean
			subElements: boolean
		}
		attributes: {
			[key: string]: {
				required: boolean
				types: string[]
			}
		}
		subElements: {
			[key: string]: {
				required: boolean
				array: boolean
			}
		}
	}
} = {}

//====== HELPERS ======//

function pascalToCamelCase(string: string) {
	return string.charAt(0).toLowerCase() + string.slice(1)
}

//====== PUBLIC FUNCTIONS ======//

export default function () {
	const project = new Project({
		tsConfigFilePath: './tsconfig.json',
		skipAddingFilesFromTsConfig: true
	})

	project.addSourceFilesAtPaths('./src/ed2/definition/index.ts')
	project.resolveSourceFileDependencies()

	const sourceFiles = project.getSourceFiles()

	for (const sourceFile of sourceFiles) {
		const namespace = sourceFile
			.getModules()
			.find((module) => module.hasNamespaceKeyword())

		if (namespace) resolveType(namespace, sourceFile)
	}

	return mappedTypesResult
}

//====== PRIVATE FUNCTIONS ======//

function resolveType(namespace: ModuleDeclaration, sourceFile: SourceFile) {
	for (const typeAlias of namespace.getTypeAliases()) {
		let typeName = pascalToCamelCase(typeAlias.getName())
		if (typeName === 'root')
			typeName = pascalToCamelCase(namespace.getName())

		const type = typeAlias.getType()

		const properties = type.getProperties()

		// type without explicit tag property are not proper Element
		if (!type.getProperty('tag')) continue

		mappedTypesResult[typeName] = {
			tag: '',
			anyAllowed: {
				attributes: false,
				subElements: false
			},
			attributes: {},
			subElements: {}
		}

		resolveTypeProperties({
			properties,
			sourceFile,
			typeName
		})
	}
}

function resolveTypeProperties({
	properties,
	sourceFile,
	typeName
}: {
	properties: TSMorphSymbol[]
	sourceFile: SourceFile
	typeName: string
}) {
	for (const property of properties) {
		const subProperties = property
			.getTypeAtLocation(sourceFile)
			.getProperties()

		resolveSubProperties({ property, subProperties, sourceFile, typeName })
	}
}

function resolveSubProperties({
	property,
	subProperties,
	sourceFile,
	typeName
}: {
	property: TSMorphSymbol
	subProperties: TSMorphSymbol[]
	sourceFile: SourceFile
	typeName: string
}) {
	for (const subProperty of subProperties) {
		const currentSubProperty = subProperty.getName()

		switch (property.getName()) {
			case 'tag':
				resolveTagSubProperty({ property, sourceFile, typeName })
				break
			case 'attributes':
				resolveAttributesSubProperty({
					property,
					subProperty,
					currentSubProperty,
					sourceFile,
					typeName
				})
				break
			case 'subElements':
				resolveSubElementsSubProperty({
					subProperty,
					currentSubProperty,
					sourceFile,
					typeName
				})
				break
		}
	}
}
function resolveTagSubProperty({
	property,
	sourceFile,
	typeName
}: {
	property: TSMorphSymbol
	sourceFile: SourceFile
	typeName: string
}) {
	mappedTypesResult[typeName].tag =
		property.getTypeAtLocation(sourceFile).getLiteralValue()?.toString() ||
		''
}

function resolveAttributesSubProperty({
	property,
	subProperty,
	currentSubProperty,
	sourceFile,
	typeName
}: {
	property: TSMorphSymbol
	subProperty: TSMorphSymbol
	currentSubProperty: string
	sourceFile: SourceFile
	typeName: string
}) {
	mappedTypesResult[typeName].anyAllowed.attributes = property
		.getTypeAtLocation(sourceFile)
		.getIntersectionTypes()
		.map((t) => t.getAliasSymbol()?.getName())
		.includes('AnyAttributes')

	mappedTypesResult[typeName].attributes[currentSubProperty] = {
		required: !subProperty.isOptional(),
		types: subProperty
			.getTypeAtLocation(sourceFile)
			.getText()
			.trim()
			.split('|')
	}
}

function resolveSubElementsSubProperty({
	subProperty,
	currentSubProperty,
	sourceFile,
	typeName
}: {
	subProperty: TSMorphSymbol
	currentSubProperty: string
	sourceFile: SourceFile
	typeName: string
}) {
	if (currentSubProperty === 'any')
		mappedTypesResult[typeName].anyAllowed.subElements = true
	else
		mappedTypesResult[typeName].subElements[currentSubProperty] = {
			required: !subProperty.isOptional(),
			array: subProperty
				.getTypeAtLocation(sourceFile)
				.getUnionTypes()
				.some((t) => t.isArray())
		}
}
