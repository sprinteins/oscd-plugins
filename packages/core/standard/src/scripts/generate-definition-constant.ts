import { Project } from 'ts-morph'
import * as path from 'node:path'
import { fileURLToPath } from 'node:url'
// TYPES
import type {
	ModuleDeclaration,
	SourceFile,
	Symbol as TSMorphSymbol
} from 'ts-morph'

//====== INITIALIZATION ======//

const mappedTypesResult: {
	[key: string]: {
		tag: string
		anyAllowed: {
			attributes: boolean | null
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
} = {} as const

//====== HELPERS ======//

function pascalToCamelCase(string: string) {
	return string.charAt(0).toLowerCase() + string.slice(1)
}

const __filename = fileURLToPath(import.meta.url)
const __dirname = path.dirname(__filename)

//====== PUBLIC FUNCTIONS ======//

export default function ({
	stableSourcePath,
	unstableSourcePath
}: {
	stableSourcePath: string
	unstableSourcePath?: string
}): typeof mappedTypesResult {
	// Reset mappedTypesResult to ensure it is empty on each call
	for (const key of Object.keys(mappedTypesResult))
		delete mappedTypesResult[key]

	const project = new Project({
		tsConfigFilePath: path.resolve(__dirname, '../../tsconfig.json'),
		skipAddingFilesFromTsConfig: true
	})

	project.addSourceFilesAtPaths(stableSourcePath)
	if (unstableSourcePath) project.addSourceFilesAtPaths(unstableSourcePath)

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

		if (!mappedTypesResult[typeName])
			mappedTypesResult[typeName] = {
				tag: '',
				anyAllowed: {
					attributes: null,
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
	switch (property.getName()) {
		case 'tag':
			resolveTagSubProperty({ property, sourceFile, typeName })
			break
		case 'attributes':
			resolveAttributesSubProperty({
				property,
				subProperties,
				sourceFile,
				typeName
			})
			break
		case 'subElements':
			resolveSubElementsSubProperty({
				property,
				subProperties,
				sourceFile,
				typeName
			})
			break
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
	const tagName = property
		.getTypeAtLocation(sourceFile)
		.getLiteralValue()
		?.toString()
	mappedTypesResult[typeName].tag = tagName || ''
}

function resolveAttributesSubProperty({
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
	if (!subProperties.length) {
		mappedTypesResult[typeName].anyAllowed.attributes = false
		return
	}

	for (const subProperty of subProperties) {
		const currentSubPropertyName = subProperty?.getName()

		if (mappedTypesResult[typeName].anyAllowed.attributes === null) {
			const isAnyAttributeIntersectionOfCurrentAttribute = property
				.getTypeAtLocation(sourceFile)
				.getIntersectionTypes()
				.map((t) => t.getAliasSymbol()?.getName())
				.includes('AnyAttributes')

			mappedTypesResult[typeName].anyAllowed.attributes =
				isAnyAttributeIntersectionOfCurrentAttribute
		}
		mappedTypesResult[typeName].attributes[currentSubPropertyName] = {
			required: !subProperty.isOptional(),
			types: subProperty
				.getTypeAtLocation(sourceFile)
				.getText()
				.trim()
				.split('|')
		}
	}
}

function resolveSubElementsSubProperty({
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
	// TODO: anyElement is not recognized yet
	// if (typeName === 'private') {
	// 	console.log('PRIVATE')
	// }
	// const test = (t) => {
	// 	console.log(t.getAliasSymbol()?.getName())
	// 	const isRecordOfAnyElementIntersectionOfCurrentSubElement =
	// 		t.getAliasSymbol()?.getName() === 'Record' &&
	// 		t
	// 			.getUnionTypes()
	// 			.some((t) => t.getAliasSymbol()?.getName() === 'AnyElement')
	// 	console.log(t.getUnionTypes())
	// 	if (isRecordOfAnyElementIntersectionOfCurrentSubElement)
	// 		return 'AnyElement'
	// 	console.log(t.getAliasSymbol()?.getName())
	// 	return t.getAliasSymbol()?.getName()
	// }
	// const isAnyElementIntersectionOfCurrentSubElement = property
	// 	.getTypeAtLocation(sourceFile)
	// 	.getIntersectionTypes()
	// 	.map((t) => test(t))
	// 	.includes('AnyElement')

	// mappedTypesResult[typeName].anyAllowed.subElements =
	// 	isAnyElementIntersectionOfCurrentSubElement

	for (const subProperty of subProperties) {
		const currentSubPropertyName = subProperty?.getName()

		mappedTypesResult[typeName].subElements[currentSubPropertyName] = {
			required: !subProperty.isOptional(),
			array: subProperty
				.getTypeAtLocation(sourceFile)
				.getUnionTypes()
				.some((t) => t.isArray())
		}
	}
}
