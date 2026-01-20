import type { XMLEditor } from '@openscd/oscd-editor'
import type { LNodeTemplate } from '../../types'
import { ssdImportStore } from '../../stores'
import { getDocumentAndEditor, getOrCreateDataTypeTemplates } from '../utils/document-helpers'
import { cloneAndInsertElement, copyElements } from './type-copier'
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

/**
 * Copies an LNodeType from SSD to SCD
 */
function copyLNodeType(
	lnodeTemplate: LNodeTemplate,
	doc: Document,
	editor: XMLEditor,
	dataTypeTemplates: Element
): void {
	cloneAndInsertElement(
		lnodeTemplate.lnType,
		'LNodeType',
		doc,
		editor,
		dataTypeTemplates,
		getLNodeTypeReference
	)
}

/**
 * Recursively copies DOTypes and their dependencies
 */
function copyDoTypes(
	doTypeIds: string[],
	doc: Document,
	editor: XMLEditor,
	dataTypeTemplates: Element
): void {
	const daTypeIdsToCopy = new Set<string>()
	const enumTypeIdsToCopy = new Set<string>()

	for (const doTypeId of doTypeIds) {
		const clonedDOType = cloneAndInsertElement(
			doTypeId,
			'DOType',
			doc,
			editor,
			dataTypeTemplates,
			getDoTypeReference
		)

		if (clonedDOType) {
			const { daTypeIds, enumTypeIds } = collectTypesFromDOType(clonedDOType)
			for (const id of daTypeIds) {
				daTypeIdsToCopy.add(id)
			}
			for (const id of enumTypeIds) {
				enumTypeIdsToCopy.add(id)
			}
		}
	}

	copyDaTypes(Array.from(daTypeIdsToCopy), doc, editor, dataTypeTemplates)
	copyEnumTypes(Array.from(enumTypeIdsToCopy), doc, editor, dataTypeTemplates)
}

/**
 * Recursively copies DATypes and their dependencies
 */
function copyDaTypes(
	daTypeIds: string[],
	doc: Document,
	editor: XMLEditor,
	dataTypeTemplates: Element
): void {
	const nestedDaTypeIds = new Set<string>()
	const enumTypeIdsToCopy = new Set<string>()

	for (const daTypeId of daTypeIds) {
		const clonedDAType = cloneAndInsertElement(
			daTypeId,
			'DAType',
			doc,
			editor,
			dataTypeTemplates,
			getDaTypeReference
		)

		if (clonedDAType) {
			const { daTypeIds, enumTypeIds } = collectTypesFromDAType(clonedDAType)
			for (const id of daTypeIds) {
				nestedDaTypeIds.add(id)
			}
			for (const id of enumTypeIds) {
				enumTypeIdsToCopy.add(id)
			}
		}
	}

	// Recursively copy nested DATypes
	if (nestedDaTypeIds.size > 0) {
		copyDaTypes(Array.from(nestedDaTypeIds), doc, editor, dataTypeTemplates)
	}

	copyEnumTypes(Array.from(enumTypeIdsToCopy), doc, editor, dataTypeTemplates)
}

/**
 * Copies EnumTypes from SSD to SCD
 */
function copyEnumTypes(
	enumTypeIds: string[],
	doc: Document,
	editor: XMLEditor,
	dataTypeTemplates: Element
): void {
	copyElements(
		enumTypeIds,
		'EnumType',
		doc,
		editor,
		dataTypeTemplates,
		getEnumTypeReference
	)
}

/**
 * Copies all relevant DataType templates from SSD to SCD for a given LNode
 * This includes LNodeType, DOTypes, DATypes, and EnumTypes
 * 
 * @param lnodeTemplate The LNode template from SSD
 */
export function copyRelevantDataTypeTemplates(
	lnodeTemplate: LNodeTemplate
): void {
	const { doc, editor } = getDocumentAndEditor()
	const dataTypeTemplates = getOrCreateDataTypeTemplates(doc, editor)

	// Step 1: Copy LNodeType
	copyLNodeType(lnodeTemplate, doc, editor, dataTypeTemplates)

	// Step 2: Find and copy all referenced DOTypes
	const lnodeType = ssdImportStore.loadedSSDDocument?.querySelector(
		`LNodeType[id="${lnodeTemplate.lnType}"]`
	)

	if (!lnodeType) {
		console.warn(`LNodeType ${lnodeTemplate.lnType} not found in SSD`)
		return
	}

	const doTypeIds = collectDOTypesFromLNodeType(lnodeType)
	copyDoTypes(doTypeIds, doc, editor, dataTypeTemplates)
}
