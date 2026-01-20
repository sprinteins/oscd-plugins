import { v4 as uuidv4 } from 'uuid'
import type { Insert } from '@openscd/oscd-api'
import type { ConductingEquipmentTemplate, FunctionTemplate, LNodeTemplate } from '../../types'
import { bayTypesStore } from '../../stores'
import { getBayElement } from '../utils/document-helpers'
import { getNextLNodeInstance } from '../utils/element-helpers'

/**
 * Creates an LNode reference element in the Bay structure
 * @param doc The XML document
 * @param lnodeTemplate The LNode template
 * @param iedName The IED name
 * @param lDeviceInst The LDevice instance
 * @returns The created LNode element
 */
export function createLNodeElement(
	doc: Document,
	lnodeTemplate: LNodeTemplate,
	iedName: string,
	lDeviceInst: string,
	parentElement: Element
): Element {
	const lNodeElement = doc.createElement('LNode')

	lNodeElement.setAttribute('iedName', iedName)
	lNodeElement.setAttribute('ldInst', lDeviceInst)
	lNodeElement.setAttribute('lnClass', lnodeTemplate.lnClass)
	lNodeElement.setAttribute('lnInst', getNextLNodeInstance(parentElement, lnodeTemplate.lnClass))
	lNodeElement.setAttribute('uuid', uuidv4())

	return lNodeElement
}

/**
 * Finds the parent element (Function or ConductingEquipment) for an LNode
 * @param doc The XML document
 * @param functionFromSSD The function template
 * @returns The parent element
 */
export function findLNodeParentElement(
	doc: Document,
	functionFromSSD: ConductingEquipmentTemplate | FunctionTemplate
): Element {
	const bayName = bayTypesStore.selectedBayType
	if (!bayName) {
		throw new Error('No bay type selected')
	}

	const bayElement = getBayElement(doc, bayName)
	let parentElement: Element | null = null

	if ('eqFunctions' in functionFromSSD) {
		// It's a ConductingEquipment
		parentElement = bayElement.querySelector(
			`ConductingEquipment[name="${functionFromSSD.name}"]`
		)
	} else {
		// It's a Function
		parentElement = bayElement.querySelector(
			`Function[name="${functionFromSSD.name}"]`
		)
	}

	if (!parentElement) {
		const type = 'eqFunctions' in functionFromSSD ? 'ConductingEquipment' : 'Function'
		throw new Error(
			`${type} with name ${functionFromSSD.name} not found in Bay ${bayName}`
		)
	}

	return parentElement
}

/**
 * Creates an Insert edit for adding an LNode reference to the Bay structure
 * @param doc The XML document
 * @param lnodeTemplate The LNode template
 * @param functionFromSSD The function template
 * @param iedName The IED name
 * @param lDeviceInst The LDevice instance
 * @returns The Insert edit for creating the LNode
 */
export function createLNodeInsertEdit(
	doc: Document,
	lnodeTemplate: LNodeTemplate,
	functionFromSSD: ConductingEquipmentTemplate | FunctionTemplate,
	iedName: string,
	lDeviceInst: string
): Insert {
	const parentElement = findLNodeParentElement(doc, functionFromSSD)
	const lNodeElement = createLNodeElement(
		doc,
		lnodeTemplate,
		iedName,
		lDeviceInst,
		parentElement
	)

	return {
		parent: parentElement,
		node: lNodeElement,
		reference: null
	}
}
