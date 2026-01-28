import type { Insert } from '@openscd/oscd-api'
import type { LNodeTemplate } from '@/headless/types'
import { ssdImportStore } from '@/headless/stores'
import { getDocumentAndEditor } from '@/headless/utils'
import {
	collectDOTypesFromLNodeType,
	collectTypesFromDOType,
	collectTypesFromDAType
} from './type-collectors'
import {
	getLNodeTypeReference,
	getDoTypeReference,
	getDaTypeReference,
	getEnumTypeReference
} from './insertion-references'
import type { XMLEditor } from '@openscd/oscd-editor'

interface TypeCollections {
	lnodeTypeIds: Set<string>
	doTypeIds: Set<string>
	daTypeIds: Set<string>
	enumTypeIds: Set<string>
}

function collectAllTypeIds(lnodeTemplate: LNodeTemplate): TypeCollections {
	const collections: TypeCollections = {
		lnodeTypeIds: new Set([lnodeTemplate.lnType]),
		doTypeIds: new Set(),
		daTypeIds: new Set(),
		enumTypeIds: new Set()
	}

	const lnodeType = ssdImportStore.loadedSSDDocument?.querySelector(
		`LNodeType[id="${lnodeTemplate.lnType}"]`
	)

	if (!lnodeType) {
		console.warn(`LNodeType ${lnodeTemplate.lnType} not found in SSD`)
		return collections
	}

	// Collect DOTypes
	const doTypeIds = collectDOTypesFromLNodeType(lnodeType)
	for (const id of doTypeIds) {
		collections.doTypeIds.add(id)
	}

	// Collect DATypes and EnumTypes from DOTypes
	for (const doTypeId of doTypeIds) {
		const doTypeElement = ssdImportStore.loadedSSDDocument?.querySelector(
			`DOType[id="${doTypeId}"]`
		)
		if (doTypeElement) {
			const { daTypeIds, enumTypeIds } = collectTypesFromDOType(doTypeElement)
			for (const id of daTypeIds) {
				collections.daTypeIds.add(id)
			}
			for (const id of enumTypeIds) {
				collections.enumTypeIds.add(id)
			}
		}
	}

	// Recursively collect nested DATypes and EnumTypes
	const processedDaTypes = new Set<string>()
	const daTypeQueue = Array.from(collections.daTypeIds)

	while (daTypeQueue.length > 0) {
		const daTypeId = daTypeQueue.shift()
		if (!daTypeId || processedDaTypes.has(daTypeId)) continue
		processedDaTypes.add(daTypeId)

		const daTypeElement = ssdImportStore.loadedSSDDocument?.querySelector(
			`DAType[id="${daTypeId}"]`
		)
		if (daTypeElement) {
			const { daTypeIds, enumTypeIds } = collectTypesFromDAType(daTypeElement)
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

function filterExistingTypes(doc: Document, collections: TypeCollections): TypeCollections {
	const filtered: TypeCollections = {
		lnodeTypeIds: new Set(),
		doTypeIds: new Set(),
		daTypeIds: new Set(),
		enumTypeIds: new Set()
	}

	for (const id of collections.lnodeTypeIds) {
		if (!doc.querySelector(`LNodeType[id="${id}"]`)) {
			filtered.lnodeTypeIds.add(id)
		}
	}

	for (const id of collections.doTypeIds) {
		if (!doc.querySelector(`DOType[id="${id}"]`)) {
			filtered.doTypeIds.add(id)
		}
	}

	for (const id of collections.daTypeIds) {
		if (!doc.querySelector(`DAType[id="${id}"]`)) {
			filtered.daTypeIds.add(id)
		}
	}

	for (const id of collections.enumTypeIds) {
		if (!doc.querySelector(`EnumType[id="${id}"]`)) {
			filtered.enumTypeIds.add(id)
		}
	}

	return filtered
}

function createLNodeTypeEdits(
	dataTypeTemplates: Element,
	lnodeTypeIds: Set<string>
): Insert[] {
	const edits: Insert[] = []
	const reference = getLNodeTypeReference(dataTypeTemplates)

	for (const id of lnodeTypeIds) {
		const sourceElement = ssdImportStore.loadedSSDDocument?.querySelector(
			`LNodeType[id="${id}"]`
		)
		if (sourceElement) {
			const clonedElement = sourceElement.cloneNode(true) as Element
			edits.push({
				parent: dataTypeTemplates,
				reference,
				node: clonedElement
			})
		}
	}

	return edits
}

function createDOTypeEdits(
	dataTypeTemplates: Element,
	doTypeIds: Set<string>
): Insert[] {
	const edits: Insert[] = []
	const reference = getDoTypeReference(dataTypeTemplates)

	for (const id of doTypeIds) {
		const sourceElement = ssdImportStore.loadedSSDDocument?.querySelector(
			`DOType[id="${id}"]`
		)
		if (sourceElement) {
			const clonedElement = sourceElement.cloneNode(true) as Element
			edits.push({
				parent: dataTypeTemplates,
				reference,
				node: clonedElement
			})
		}
	}

	return edits
}

function createDATypeEdits(
	dataTypeTemplates: Element,
	daTypeIds: Set<string>
): Insert[] {
	const edits: Insert[] = []
	const reference = getDaTypeReference(dataTypeTemplates)

	for (const id of daTypeIds) {
		const sourceElement = ssdImportStore.loadedSSDDocument?.querySelector(
			`DAType[id="${id}"]`
		)
		if (sourceElement) {
			const clonedElement = sourceElement.cloneNode(true) as Element
			edits.push({
				parent: dataTypeTemplates,
				reference,
				node: clonedElement
			})
		}
	}

	return edits
}

function createEnumTypeEdits(
	dataTypeTemplates: Element,
	enumTypeIds: Set<string>
): Insert[] {
	const edits: Insert[] = []
	const reference = getEnumTypeReference(dataTypeTemplates)

	for (const id of enumTypeIds) {
		const sourceElement = ssdImportStore.loadedSSDDocument?.querySelector(
			`EnumType[id="${id}"]`
		)
		if (sourceElement) {
			const clonedElement = sourceElement.cloneNode(true) as Element
			edits.push({
				parent: dataTypeTemplates,
				reference,
				node: clonedElement
			})
		}
	}

	return edits
}

export function collectAllTypesFromLNodeTemplates(
	lnodeTemplates: LNodeTemplate[]
): TypeCollections {
	const allCollections: TypeCollections = {
		lnodeTypeIds: new Set(),
		doTypeIds: new Set(),
		daTypeIds: new Set(),
		enumTypeIds: new Set()
	}

	for (const lnodeTemplate of lnodeTemplates) {
		const collections = collectAllTypeIds(lnodeTemplate)
		
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

export function insertDataTypeTemplatesInStages(
	doc: Document,
	dataTypeTemplates: Element,
	lnodeTemplates: LNodeTemplate[],
	editor: XMLEditor
): void {
	// Collect all types from all LNode templates
	const allCollections = collectAllTypesFromLNodeTemplates(lnodeTemplates)
	
	// Filter out existing types
	const missingCollections = filterExistingTypes(doc, allCollections)

	// Stage 1: Insert LNodeTypes (no squash for first stage)
	const lnodeTypeEdits = createLNodeTypeEdits(dataTypeTemplates, missingCollections.lnodeTypeIds)
	if (lnodeTypeEdits.length > 0) {
		editor.commit(lnodeTypeEdits, { squash: true})
	}

	// Stage 2: Insert DOTypes (squash, no title update)
	const doTypeEdits = createDOTypeEdits(dataTypeTemplates, missingCollections.doTypeIds)
	if (doTypeEdits.length > 0) {
		editor.commit(doTypeEdits, { squash: true })
	}

	// Stage 3: Insert DATypes (squash, no title update)
	const daTypeEdits = createDATypeEdits(dataTypeTemplates, missingCollections.daTypeIds)
	if (daTypeEdits.length > 0) {
		editor.commit(daTypeEdits, { squash: true })
	}

	// Stage 4: Insert EnumTypes (squash, no title update)
	const enumTypeEdits = createEnumTypeEdits(dataTypeTemplates, missingCollections.enumTypeIds)
	if (enumTypeEdits.length > 0) {
		editor.commit(enumTypeEdits, { squash: true })
	}
}

function createInsertEdits(
	doc: Document,
	dataTypeTemplates: Element,
	collections: TypeCollections
): Insert[] {
	const edits: Insert[] = []

	// Insert LNodeTypes
	for (const id of collections.lnodeTypeIds) {
		const sourceElement = ssdImportStore.loadedSSDDocument?.querySelector(
			`LNodeType[id="${id}"]`
		)
		if (sourceElement) {
			const clonedElement = sourceElement.cloneNode(true) as Element
			edits.push({
				parent: dataTypeTemplates,
				reference: getLNodeTypeReference(dataTypeTemplates),
				node: clonedElement
			})
		}
	}

	// Insert DOTypes
	for (const id of collections.doTypeIds) {
		const sourceElement = ssdImportStore.loadedSSDDocument?.querySelector(
			`DOType[id="${id}"]`
		)
		if (sourceElement) {
			const clonedElement = sourceElement.cloneNode(true) as Element
			edits.push({
				parent: dataTypeTemplates,
				reference: getDoTypeReference(dataTypeTemplates),
				node: clonedElement
			})
		}
	}

	// Insert DATypes
	for (const id of collections.daTypeIds) {
		const sourceElement = ssdImportStore.loadedSSDDocument?.querySelector(
			`DAType[id="${id}"]`
		)
		if (sourceElement) {
			const clonedElement = sourceElement.cloneNode(true) as Element
			edits.push({
				parent: dataTypeTemplates,
				reference: getDaTypeReference(dataTypeTemplates),
				node: clonedElement
			})
		}
	}

	// Insert EnumTypes
	for (const id of collections.enumTypeIds) {
		const sourceElement = ssdImportStore.loadedSSDDocument?.querySelector(
			`EnumType[id="${id}"]`
		)
		if (sourceElement) {
			const clonedElement = sourceElement.cloneNode(true) as Element
			edits.push({
				parent: dataTypeTemplates,
				reference: getEnumTypeReference(dataTypeTemplates),
				node: clonedElement
			})
		}
	}

	return edits
}

export function collectRelevantDataTypeTemplateEdits(
	lnodeTemplate: LNodeTemplate,
	dataTypeTemplates: Element
): Insert[] {
	const { doc } = getDocumentAndEditor()

	// Phase 1: Collect all type IDs
	const allCollections = collectAllTypeIds(lnodeTemplate)

	// Phase 2: Filter out existing types
	const missingCollections = filterExistingTypes(doc, allCollections)

	// Phase 3: Create Insert edits in proper order
	const edits = createInsertEdits(doc, dataTypeTemplates, missingCollections)

	return edits
}
