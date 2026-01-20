import type { LNodeTemplate } from '../types'
import { ssdImportStore } from '../stores'
import type { Insert } from '@openscd/oscd-api'
import {
	getDocumentAndEditor,
	elementExists,
	getOrCreateDataTypeTemplates
} from './common-helpers'

/**
 * Collects type references from DO/DA elements
 * @param elements Elements to scan for type references
 * @returns Object with daType and enumType IDs
 */
function collectTypeReferences(
	elements: NodeListOf<Element>
): { daTypeIds: Set<string>; enumTypeIds: Set<string> } {
	const daTypeIds = new Set<string>()
	const enumTypeIds = new Set<string>()

	for (const element of elements) {
		const type = element.getAttribute('type')
		const bType = element.getAttribute('bType')

		if (!type) continue

		if (bType === 'Struct') {
			daTypeIds.add(type)
		} else if (bType === 'Enum') {
			enumTypeIds.add(type)
		}
	}

	return { daTypeIds, enumTypeIds }
}

/**
 * Clones and inserts an element from SSD to SCD
 * @param elementId The ID of the element to copy
 * @param elementType The type of element (LNodeType, DOType, etc.)
 * @param doc The target document
 * @param editor The editor instance
 * @param dataTypeTemplates The DataTypeTemplates container
 * @param getReferenceFunc Function to get the insertion reference
 * @returns The cloned element or null if not found/already exists
 */
function cloneAndInsertElement(
	elementId: string,
	elementType: string,
	doc: Document,
	editor: ReturnType<typeof getDocumentAndEditor>['editor'],
	dataTypeTemplates: Element,
	getReferenceFunc: (container: Element) => Node | null
): Element | null {
	// Skip if already exists
	if (elementExists(doc, `${elementType}[id="${elementId}"]`)) {
		return null
	}

	// Find element in SSD
	const sourceElement = ssdImportStore.loadedSSDDocument?.querySelector(
		`${elementType}[id="${elementId}"]`
	)
	if (!sourceElement) {
		console.warn(`${elementType} with id="${elementId}" not found in SSD`)
		return null
	}

	// Clone and insert
	const clonedElement = sourceElement.cloneNode(true) as Element
	const reference = getReferenceFunc(dataTypeTemplates)

	const edit: Insert = {
		parent: dataTypeTemplates,
		reference: reference,
		node: clonedElement
	}

	editor.commit(edit, {
		title: `Copy ${elementType} ${elementId} from SSD`
	})

	return clonedElement
}

/**
 * Gets the insertion reference for LNodeType elements
 */
function getLNodeTypeReference(dataTypeTemplates: Element): Node | null {
	const lnodeTypes = Array.from(
		dataTypeTemplates.querySelectorAll('LNodeType')
	)
	return lnodeTypes.length > 0
		? lnodeTypes[lnodeTypes.length - 1].nextSibling
		: dataTypeTemplates.firstChild
}

/**
 * Gets the insertion reference for DOType elements
 */
function getDoTypeReference(dataTypeTemplates: Element): Node | null {
	const doTypes = Array.from(dataTypeTemplates.querySelectorAll('DOType'))
	if (doTypes.length > 0) {
		return doTypes[doTypes.length - 1].nextSibling
	}

	const lnodeTypes = Array.from(
		dataTypeTemplates.querySelectorAll('LNodeType')
	)
	return lnodeTypes.length > 0
		? lnodeTypes[lnodeTypes.length - 1].nextSibling
		: dataTypeTemplates.firstChild
}

/**
 * Gets the insertion reference for DAType elements
 */
function getDaTypeReference(dataTypeTemplates: Element): Node | null {
	const daTypes = Array.from(dataTypeTemplates.querySelectorAll('DAType'))
	if (daTypes.length > 0) {
		return daTypes[daTypes.length - 1].nextSibling
	}

	const doTypes = Array.from(dataTypeTemplates.querySelectorAll('DOType'))
	if (doTypes.length > 0) {
		return doTypes[doTypes.length - 1].nextSibling
	}

	const lnodeTypes = Array.from(
		dataTypeTemplates.querySelectorAll('LNodeType')
	)
	return lnodeTypes.length > 0
		? lnodeTypes[lnodeTypes.length - 1].nextSibling
		: dataTypeTemplates.firstChild
}

/**
 * Gets the insertion reference for EnumType elements
 */
function getEnumTypeReference(dataTypeTemplates: Element): Node | null {
	const enumTypes = Array.from(dataTypeTemplates.querySelectorAll('EnumType'))
	if (enumTypes.length > 0) {
		return enumTypes[enumTypes.length - 1].nextSibling
	}

	const daTypes = Array.from(dataTypeTemplates.querySelectorAll('DAType'))
	if (daTypes.length > 0) {
		return daTypes[daTypes.length - 1].nextSibling
	}

	const doTypes = Array.from(dataTypeTemplates.querySelectorAll('DOType'))
	if (doTypes.length > 0) {
		return doTypes[doTypes.length - 1].nextSibling
	}

	const lnodeTypes = Array.from(
		dataTypeTemplates.querySelectorAll('LNodeType')
	)
	return lnodeTypes.length > 0
		? lnodeTypes[lnodeTypes.length - 1].nextSibling
		: dataTypeTemplates.firstChild
}

/**
 * Copies an LNodeType from SSD to SCD
 */
function copyLNodeType(
	lnodeTemplate: LNodeTemplate,
	doc: Document,
	editor: ReturnType<typeof getDocumentAndEditor>['editor'],
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
	editor: ReturnType<typeof getDocumentAndEditor>['editor'],
	dataTypeTemplates: Element
): void {
	const daTypeIdsToCopy = new Set<string>()
	const enumTypeIdsToCopy = new Set<string>()

	for (const doTypeId of doTypeIds) {
		const clonedElement = cloneAndInsertElement(
			doTypeId,
			'DOType',
			doc,
			editor,
			dataTypeTemplates,
			getDoTypeReference
		)

		if (clonedElement) {
			// Collect referenced types
			const dataAttributes = clonedElement.querySelectorAll('DA, BDA')
			const refs = collectTypeReferences(dataAttributes)
			for (const id of refs.daTypeIds) {
				daTypeIdsToCopy.add(id)
			}
			for (const id of refs.enumTypeIds) {
				enumTypeIdsToCopy.add(id)
			}
		}
	}

	// Recursively copy dependencies
	copyDaTypes(Array.from(daTypeIdsToCopy), doc, editor, dataTypeTemplates)
	copyEnumTypes(Array.from(enumTypeIdsToCopy), doc, editor, dataTypeTemplates)
}

/**
 * Recursively copies DATypes and their dependencies
 */
function copyDaTypes(
	daTypeIds: string[],
	doc: Document,
	editor: ReturnType<typeof getDocumentAndEditor>['editor'],
	dataTypeTemplates: Element
): void {
	const nestedDaTypeIds = new Set<string>()
	const enumTypeIdsToCopy = new Set<string>()

	for (const daTypeId of daTypeIds) {
		const clonedElement = cloneAndInsertElement(
			daTypeId,
			'DAType',
			doc,
			editor,
			dataTypeTemplates,
			getDaTypeReference
		)

		if (clonedElement) {
			// Collect nested references
			const dataAttributes = clonedElement.querySelectorAll('BDA')
			const refs = collectTypeReferences(dataAttributes)
			for (const id of refs.daTypeIds) {
				nestedDaTypeIds.add(id)
			}
			for (const id of refs.enumTypeIds) {
				enumTypeIdsToCopy.add(id)
			}
		}
	}

	// Recursively copy dependencies
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
	editor: ReturnType<typeof getDocumentAndEditor>['editor'],
	dataTypeTemplates: Element
): void {
	for (const enumTypeId of enumTypeIds) {
		cloneAndInsertElement(
			enumTypeId,
			'EnumType',
			doc,
			editor,
			dataTypeTemplates,
			getEnumTypeReference
		)
	}
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

	// Step 2: Copy all referenced DOTypes and their dependencies
	const lnodeTypeInSSD = ssdImportStore.lnodeTypes.find(
		(lnt) => lnt.id === lnodeTemplate.lnType
	)

	if (lnodeTypeInSSD) {
		const referencedDoTypeIds = Array.from(
			new Set(lnodeTypeInSSD.dataObjects.map((d) => d.type))
		)
		copyDoTypes(referencedDoTypeIds, doc, editor, dataTypeTemplates)
	}
}
