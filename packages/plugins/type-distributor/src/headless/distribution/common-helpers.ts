import { pluginGlobalStore } from '@oscd-plugins/core-ui-svelte'
import type { XMLEditor } from '@openscd/oscd-editor'

/**
 * Gets the document and editor from pluginGlobalStore with proper error handling
 * @throws Error if document or editor is not available
 * @returns Object containing document and editor
 */
export function getDocumentAndEditor(): {
	doc: XMLDocument
	editor: XMLEditor
} {
	const doc = pluginGlobalStore.xmlDocument
	if (!doc) {
		throw new Error('No XML document loaded')
	}

	const editor = pluginGlobalStore.editor
	if (!editor) {
		throw new Error('No editor available')
	}

	return { doc, editor }
}

/**
 * Finds an AccessPoint element in the document
 * @param doc The XML document
 * @param iedName The IED name
 * @param apName The AccessPoint name
 * @throws Error if AccessPoint is not found
 * @returns The AccessPoint element
 */
export function getAccessPoint(
	doc: Document,
	iedName: string,
	apName: string
): Element {
	const accessPoint = doc.querySelector(
		`IED[name="${iedName}"] > AccessPoint[name="${apName}"]`
	)
	if (!accessPoint) {
		throw new Error(`AccessPoint ${apName} not found in IED ${iedName}`)
	}
	return accessPoint
}

/**
 * Finds a Bay element in the document
 * @param doc The XML document
 * @param bayName The Bay name
 * @throws Error if Bay is not found
 * @returns The Bay element
 */
export function getBayElement(doc: Document, bayName: string): Element {
	const bayElement = doc.querySelector(`Bay[name="${bayName}"]`)
	if (!bayElement) {
		throw new Error(`Bay with name ${bayName} not found`)
	}
	return bayElement
}

/**
 * Gets or creates DataTypeTemplates element in the document
 * @param doc The XML document
 * @param editor The editor instance
 * @returns The DataTypeTemplates element
 */
export function getOrCreateDataTypeTemplates(
	doc: XMLDocument,
	editor: XMLEditor
): Element {
	let dataTypeTemplates = doc.querySelector('DataTypeTemplates')
	if (!dataTypeTemplates) {
		dataTypeTemplates = doc.createElement('DataTypeTemplates')
		const root = doc.documentElement
		editor.commit(
			{
				node: dataTypeTemplates,
				parent: root,
				reference: null
			},
			{ title: 'Create DataTypeTemplates' }
		)
	}
	return dataTypeTemplates
}

/**
 * Checks if an element exists in the document
 * @param doc The document to check
 * @param selector The CSS selector
 * @returns True if element exists, false otherwise
 */
export function elementExists(doc: Document, selector: string): boolean {
	return doc.querySelector(selector) !== null
}

/**
 * Gets the next available LNode instance number for a given class
 * @param parent The parent element to search within
 * @param lnClass The LNode class
 * @returns The next available instance number as string
 */
export function getNextLNodeInstance(
	parent: Element,
	lnClass: string
): string {
	const existingLNodes = Array.from(
		parent.querySelectorAll(`LN[lnClass="${lnClass}"]`)
	)
	if (existingLNodes.length === 0) {
		return '1'
	}

	const instances = existingLNodes
		.map((ln) => Number.parseInt(ln.getAttribute('lnInst') || '0', 10))
		.filter((n) => !Number.isNaN(n))

	const maxInstance = Math.max(...instances, 0)
	return String(maxInstance + 1)
}

/**
 * Checks if conducting equipment is part of a template structure
 * @param element The conducting equipment element
 * @returns True if it has template-related attributes
 */
export function isConductingEquipmentFromTemplate(
	element: ConductingEquipmentTemplate
): boolean {
	return 'eqFunctions' in element && element.eqFunctions.length > 0
}

/**
 * Generates an LDevice inst attribute from function information
 * @param functionName The function name
 * @param conductingEquipmentName Optional conducting equipment name
 * @returns The LDevice inst string
 */
export function generateLDeviceInst(
	functionName: string,
	conductingEquipmentName?: string
): string {
	if (conductingEquipmentName) {
		return `${conductingEquipmentName}_${functionName}`
	}
	return functionName
}

// Type imports for documentation
import type { ConductingEquipmentTemplate } from '../types'
