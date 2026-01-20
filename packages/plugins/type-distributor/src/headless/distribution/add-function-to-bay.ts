import type { FunctionTemplate } from '../types'
import { bayTypesStore, ssdImportStore } from '../stores'
import { v4 as uuidv4 } from 'uuid'
import type { Insert } from '@openscd/oscd-api'
import {
	getDocumentAndEditor,
	getBayElement
} from './common-helpers'

/**
 * Creates a Function element with all required attributes
 * @param doc The XML document
 * @param functionTemplate The function template from SSD
 * @param templateUuid The UUID from the bay type
 * @returns The created Function element
 */
function createFunctionElement(
	doc: Document,
	functionTemplate: FunctionTemplate,
	templateUuid: string
): Element {
	const functionElement = doc.createElement('Function')
	functionElement.setAttribute('name', functionTemplate.name)
	
	if (functionTemplate.desc) {
		functionElement.setAttribute('desc', functionTemplate.desc)
	}
	
	functionElement.setAttribute('templateUuid', templateUuid)
	functionElement.setAttribute('originUuid', functionTemplate.uuid)
	functionElement.setAttribute('uuid', uuidv4())

	return functionElement
}

/**
 * Finds the function in the bay type that matches the template
 * @param functionTemplate The function template from SSD
 * @throws Error if function not found in bay type
 * @returns The UUID of the function in the bay type
 */
function getFunctionTemplateUuidFromBayType(
	functionTemplate: FunctionTemplate
): string {
	const bayType = ssdImportStore.bayTypes.find(
		(bay) => bay.name === bayTypesStore.selectedBayType
	)

	if (!bayType) {
		throw new Error(`Bay type ${bayTypesStore.selectedBayType} not found`)
	}

	const functionInTemplateBay = bayType.functions.find(
		(func) => func.templateUuid === functionTemplate.uuid
	)

	if (!functionInTemplateBay) {
		throw new Error(
			`Function template with UUID ${functionTemplate.uuid} not found in bay type ${bayType.name}`
		)
	}

	return functionInTemplateBay.uuid
}

/**
 * Gets the reference element for inserting a Function in a Bay
 * Functions should be inserted before ConnectivityNode if it exists
 * @param bayElement The bay element
 * @returns The reference element or null
 */
function getFunctionInsertionReference(bayElement: Element): Node | null {
	return bayElement.querySelector('ConnectivityNode')
}

// TODO: This would also have to handle the LNodes within the Function and we need the case when its used as an EqFunction and we drag that one
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
): Insert | null {
	const bayElement = getBayElement(doc, bayName)

	// Check if function already exists
	const existingFunction = bayElement.querySelector(
		`Function[name="${functionTemplate.name}"]`
	)
	if (existingFunction) {
		return null
	}

	const templateUuid = getFunctionTemplateUuidFromBayType(functionTemplate)
	const functionElement = createFunctionElement(doc, functionTemplate, templateUuid)
	const reference = getFunctionInsertionReference(bayElement)

	return {
		parent: bayElement,
		reference: reference,
		node: functionElement
	}
}
