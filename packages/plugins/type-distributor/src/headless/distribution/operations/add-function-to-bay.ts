import type { FunctionTemplate } from '../../types'
import { bayTypesStore } from '../../stores'
import { getDocumentAndEditor } from '../utils/document-helpers'
import { createFunctionInsertEdit } from '../elements/function'

/**
 * Adds a Function element to a Bay in the SCD document
 * @param doc The XML document
 * @param functionTemplate The function template from SSD
 * @param bayName The name of the bay to add the function to
 * @returns The Insert edit for adding the function, or null if function already exists
 * @throws Error if bay not found or function template not in bay type
 */
export function addFunctionToBay(
	doc: Document,
	functionTemplate: FunctionTemplate,
	bayName: string
) {
	return createFunctionInsertEdit(doc, functionTemplate, bayName)
}

/**
 * Adds a Function to the currently selected bay type
 * @param functionTemplate The function template from SSD
 */
export function addFunctionToSelectedBay(functionTemplate: FunctionTemplate) {
	const { doc } = getDocumentAndEditor()
	const bayName = bayTypesStore.selectedBayType
	
	if (!bayName) {
		throw new Error('No bay type selected')
	}

	return addFunctionToBay(doc, functionTemplate, bayName)
}
