import type { LNodeTemplate } from '@/headless/common-types'
import {
	queryDOTypesFromLNodeType,
	queryTypesFromDAType,
	queryTypesFromDOType
} from './query-types'

export interface TypeCollections {
	lnodeTypeIds: Set<string>
	doTypeIds: Set<string>
	daTypeIds: Set<string>
	enumTypeIds: Set<string>
}

function collectTypeIdsForTemplate(
	lnodeTemplate: LNodeTemplate,
	ssdDoc: XMLDocument
): TypeCollections {
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

export function collectTypeDependencies(
	lnodeTemplates: LNodeTemplate[],
	ssdDoc: XMLDocument
): TypeCollections {
	const allCollections: TypeCollections = {
		lnodeTypeIds: new Set(),
		doTypeIds: new Set(),
		daTypeIds: new Set(),
		enumTypeIds: new Set()
	}

	for (const lnodeTemplate of lnodeTemplates) {
		const collections = collectTypeIdsForTemplate(lnodeTemplate, ssdDoc)

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
