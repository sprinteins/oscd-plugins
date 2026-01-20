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
