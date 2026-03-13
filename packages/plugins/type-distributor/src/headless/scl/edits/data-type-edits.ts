import type { Insert } from '@openscd/oscd-api'
import type { LNodeTemplate, LNodeType } from '@/headless/common-types'
import { createElement } from '@oscd-plugins/core'
import {
	collectTypeDependencies,
	type TypeCollections
} from '@/headless/domain/type-resolution'
import { createLD0LNodeTemplates } from '../elements'

const TYPE_ORDER = ['LNodeType', 'DOType', 'DAType', 'EnumType'] as const
type TypeName = (typeof TYPE_ORDER)[number]

const TYPE_TO_COLLECTION_KEY: Record<TypeName, keyof TypeCollections> = {
	LNodeType: 'lnodeTypeIds',
	DOType: 'doTypeIds',
	DAType: 'daTypeIds',
	EnumType: 'enumTypeIds'
}

function queryLastOfTypes(
	dataTypeTemplates: Element,
	typeNames: readonly string[]
): Node | null {
	for (const typeName of typeNames) {
		const elements = Array.from(
			dataTypeTemplates.querySelectorAll(typeName)
		)
		if (elements.length > 0) {
			return elements[elements.length - 1].nextSibling
		}
	}
	return dataTypeTemplates.firstChild
}

function queryTypeReference(
	dataTypeTemplates: Element,
	typeName: TypeName
): Node | null {
	const typeIndex = TYPE_ORDER.indexOf(typeName)
	const precedingTypes = TYPE_ORDER.slice(0, typeIndex + 1)
	return queryLastOfTypes(dataTypeTemplates, precedingTypes)
}

export function ensureDataTypeTemplates(doc: XMLDocument): {
	element: Element
	edit: Insert | null
} {
	let dataTypeTemplates = doc.querySelector('DataTypeTemplates')
	if (!dataTypeTemplates) {
		dataTypeTemplates = createElement(doc, 'DataTypeTemplates', {})
		const root = doc.documentElement

		const edit: Insert = {
			node: dataTypeTemplates,
			parent: root,
			reference: null
		}
		return { element: dataTypeTemplates, edit }
	}
	return { element: dataTypeTemplates, edit: null }
}

function filterMissingIds(
	doc: Document,
	ids: Set<string>,
	typeName: TypeName
): Set<string> {
	const missing = new Set<string>()
	for (const id of ids) {
		if (!doc.querySelector(`${typeName}[id="${id}"]`)) {
			missing.add(id)
		}
	}
	return missing
}

function filterExistingTypes(
	doc: Document,
	collections: TypeCollections
): TypeCollections {
	return {
		lnodeTypeIds: filterMissingIds(
			doc,
			collections.lnodeTypeIds,
			'LNodeType'
		),
		doTypeIds: filterMissingIds(doc, collections.doTypeIds, 'DOType'),
		daTypeIds: filterMissingIds(doc, collections.daTypeIds, 'DAType'),
		enumTypeIds: filterMissingIds(doc, collections.enumTypeIds, 'EnumType')
	}
}

function cloneTypeFromSSD(
	typeId: string,
	typeName: TypeName,
	ssdDoc: XMLDocument
): Element | null {
	const sourceElement = ssdDoc.querySelector(`${typeName}[id="${typeId}"]`)
	if (!sourceElement) return null
	return sourceElement.cloneNode(true) as Element
}

type BuldInserstsForTypeParams = {
	typeIds: Set<string>
	typeName: TypeName
	dataTypeTemplates: Element
	ssdDoc: XMLDocument
}

function buildInsertsForType({
	dataTypeTemplates,
	typeIds,
	typeName,
	ssdDoc
}: BuldInserstsForTypeParams): Insert[] {
	const edits: Insert[] = []
	const reference = queryTypeReference(dataTypeTemplates, typeName)

	for (const id of typeIds) {
		const clonedElement = cloneTypeFromSSD(id, typeName, ssdDoc)
		if (clonedElement) {
			edits.push({
				parent: dataTypeTemplates,
				reference,
				node: clonedElement
			})
		}
	}

	return edits
}

type BuildInsertsForDataTypeTemplatesParams = {
	doc: Document
	dataTypeTemplates: Element
	lnodeTemplates: LNodeTemplate[]
	ssdDoc: XMLDocument
}

export function buildInsertsForDataTypeTemplates({
	doc,
	dataTypeTemplates,
	lnodeTemplates,
	ssdDoc
}: BuildInsertsForDataTypeTemplatesParams): Insert[] {
	const allCollections = collectTypeDependencies(lnodeTemplates, ssdDoc)
	const missingCollections = filterExistingTypes(doc, allCollections)
	const edits: Insert[] = []

	for (const typeName of TYPE_ORDER) {
		const collectionKey = TYPE_TO_COLLECTION_KEY[typeName]
		const typeIds = missingCollections[collectionKey]

		if (typeIds.size > 0) {
			edits.push(
				...buildInsertsForType({
					dataTypeTemplates,
					typeIds,
					typeName,
					ssdDoc
				})
			)
		}
	}
	return edits
}

interface BuildInsertsForLd0DataTypesParams {
	doc: XMLDocument
	lnodeTypes: LNodeType[]
	ssdDoc: XMLDocument
}

export function buildInsertsForLd0DataTypes({
	doc,
	lnodeTypes,
	ssdDoc
}: BuildInsertsForLd0DataTypesParams): Insert[] {
	const ld0LNodeTemplates = createLD0LNodeTemplates(lnodeTypes)
	if (ld0LNodeTemplates.length === 0) return []

	const { element: dataTypeTemplates, edit: dttEdit } =
		ensureDataTypeTemplates(doc)
	const edits: Insert[] = []
	if (dttEdit) edits.push(dttEdit)
	edits.push(
		...buildInsertsForDataTypeTemplates({
			doc,
			dataTypeTemplates,
			lnodeTemplates:ld0LNodeTemplates,
			ssdDoc
		})
	)
	return edits
}
