import type { LNodeTemplate } from '@/headless/common-types'
import type { Insert } from '@openscd/oscd-editor'
import { ssdImportStore } from '@/headless/stores'
import {
	queryDOTypesFromLNodeType,
	queryTypesFromDOType,
	queryTypesFromDAType
} from './query-types'
import { TYPE_ORDER, type TypeName } from './query-insertion-references'
import { buildEditsForType } from './type-creation-helpers'

interface TypeCollections {
	lnodeTypeIds: Set<string>
	doTypeIds: Set<string>
	daTypeIds: Set<string>
	enumTypeIds: Set<string>
}

function queryAllTypeIds(lnodeTemplate: LNodeTemplate): TypeCollections {
	const ssdDoc = ssdImportStore.loadedSSDDocument
	if (!ssdDoc) {
		throw new Error('No SSD document loaded in store')
	}

	const collections: TypeCollections = {
		lnodeTypeIds: new Set([lnodeTemplate.lnType]),
		doTypeIds: new Set(),
		daTypeIds: new Set(),
		enumTypeIds: new Set()
	}

	const lnodeType = ssdDoc.querySelector(
		`LNodeType[id="${lnodeTemplate.lnType}"]`
	)

	if (!lnodeType) {
		console.warn(`LNodeType ${lnodeTemplate.lnType} not found in SSD`)
		return collections
	}

	const doTypeIds = queryDOTypesFromLNodeType(lnodeType)
	for (const id of doTypeIds) {
		collections.doTypeIds.add(id)
	}

	for (const doTypeId of doTypeIds) {
		const doTypeElement = ssdDoc.querySelector(`DOType[id="${doTypeId}"]`)
		if (doTypeElement) {
			const { daTypeIds, enumTypeIds } =
				queryTypesFromDOType(doTypeElement)
			for (const id of daTypeIds) {
				collections.daTypeIds.add(id)
			}
			for (const id of enumTypeIds) {
				collections.enumTypeIds.add(id)
			}
		}
	}

	const processedDaTypes = new Set<string>()
	const daTypeQueue = Array.from(collections.daTypeIds)

	while (daTypeQueue.length > 0) {
		const daTypeId = daTypeQueue.shift()
		if (!daTypeId || processedDaTypes.has(daTypeId)) continue
		processedDaTypes.add(daTypeId)

		const daTypeElement = ssdDoc.querySelector(`DAType[id="${daTypeId}"]`)
		if (daTypeElement) {
			const { daTypeIds, enumTypeIds } =
				queryTypesFromDAType(daTypeElement)
			for (const id of daTypeIds) {
				collections.daTypeIds.add(id)
				if (!processedDaTypes.has(id)) {
					daTypeQueue.push(id)
				}
			}
			for (const id of enumTypeIds) {
				collections.enumTypeIds.add(id)
			}
		}
	}

	return collections
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

export function queryAllTypesFromLNodeTemplates(
	lnodeTemplates: LNodeTemplate[]
): TypeCollections {
	const allCollections: TypeCollections = {
		lnodeTypeIds: new Set(),
		doTypeIds: new Set(),
		daTypeIds: new Set(),
		enumTypeIds: new Set()
	}

	for (const lnodeTemplate of lnodeTemplates) {
		const collections = queryAllTypeIds(lnodeTemplate)

		for (const id of collections.lnodeTypeIds) {
			allCollections.lnodeTypeIds.add(id)
		}
		for (const id of collections.doTypeIds) {
			allCollections.doTypeIds.add(id)
		}
		for (const id of collections.daTypeIds) {
			allCollections.daTypeIds.add(id)
		}
		for (const id of collections.enumTypeIds) {
			allCollections.enumTypeIds.add(id)
		}
	}

	return allCollections
}

const TYPE_TO_COLLECTION_KEY: Record<TypeName, keyof TypeCollections> = {
	LNodeType: 'lnodeTypeIds',
	DOType: 'doTypeIds',
	DAType: 'daTypeIds',
	EnumType: 'enumTypeIds'
}

export function buildEditsForDataTypeTemplates(
	doc: Document,
	dataTypeTemplates: Element,
	lnodeTemplates: LNodeTemplate[]
): Insert[] {
	const allCollections = queryAllTypesFromLNodeTemplates(lnodeTemplates)
	const missingCollections = filterExistingTypes(doc, allCollections)
	const edits = []

	for (const typeName of TYPE_ORDER) {
		const collectionKey = TYPE_TO_COLLECTION_KEY[typeName]
		const typeIds = missingCollections[collectionKey]

		if (typeIds.size > 0) {
			edits.push(...buildEditsForType(dataTypeTemplates, typeIds, typeName))
		}
	}
	return edits
}
