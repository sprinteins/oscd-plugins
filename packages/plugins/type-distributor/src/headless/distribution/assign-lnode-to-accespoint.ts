import type {
	ConductingEquipmentTemplate,
	FunctionTemplate,
	LNodeTemplate
} from '../types'
import { addFunctionToBay } from './add-function-to-bay'
import { bayTypesStore } from '../stores'
import type { Insert } from '@openscd/oscd-api'
import {
	getDocumentAndEditor,
	getAccessPoint,
	generateLDeviceInst,
	getNextLNodeInstance,
	getBayElement
} from './common-helpers'
import { copyRelevantDataTypeTemplates } from './copy-relevant-data-type-templates'
import { v4 as uuidv4 } from 'uuid'
import type { XMLEditor } from '@openscd/oscd-editor'

/**
 * Creates or gets existing LDevice for a function
 * @param doc The XML document
 * @param accessPoint The access point element
 * @param functionFromSSD The function or conducting equipment template
 * @returns Object containing the LDevice element and optional Insert edit if created
 */
function getOrCreateLDevice(
	doc: Document,
	accessPoint: Element,
	functionFromSSD: ConductingEquipmentTemplate | FunctionTemplate
): { lDevice: Element; edit: Insert | null } {
	let functionName = functionFromSSD.name
	let conductingEquipmentName: string | undefined

	if ('eqFunctions' in functionFromSSD) {
		conductingEquipmentName = functionFromSSD.name
		functionName = functionFromSSD.eqFunctions[0]?.name || functionName
	}

	const lDeviceInst = generateLDeviceInst(
		functionName,
		conductingEquipmentName
	)

	// Check if LDevice already exists
	let lDevice = accessPoint.querySelector(`LDevice[inst="${lDeviceInst}"]`)
	let edit: Insert | null = null
	
	if (!lDevice) {
		lDevice = doc.createElement('LDevice')
		lDevice.setAttribute('inst', lDeviceInst)

		edit = {
			parent: accessPoint,
			node: lDevice,
			reference: null
		}
	}

	return { lDevice, edit }
}

/**
 * Creates an LN element with proper attributes
 * @param doc The XML document
 * @param lnodeTemplate The LNode template from SSD
 * @param lDevice The parent LDevice element
 * @returns The created LN element
 */
function createLNElement(
	doc: Document,
	lnodeTemplate: LNodeTemplate,
	lDevice: Element
): Element {
	const lnElement = doc.createElement('LN')
	lnElement.setAttribute('lnClass', lnodeTemplate.lnClass)
	lnElement.setAttribute('lnType', lnodeTemplate.lnType)

	// Get the next available instance number
	const lnInst = getNextLNodeInstance(lDevice, lnodeTemplate.lnClass)
	lnElement.setAttribute('lnInst', lnInst)

	return lnElement
}

/**
 * Adds a Function to the Bay if needed (for non-equipment functions)
 * @param doc The XML document
 * @param functionFromSSD The function template
 * @returns The Insert edit if function was created, null otherwise
 */
function addFunctionToBayIfNeeded(
	doc: Document,
	functionFromSSD: ConductingEquipmentTemplate | FunctionTemplate
): Insert | null {
	// Only add function to bay if it's a regular function (not conducting equipment)
	if (!('eqFunctions' in functionFromSSD)) {
		const bayName = bayTypesStore.selectedBayType
		if (!bayName) {
			throw new Error('No bay type selected')
		}
		return addFunctionToBay(doc, functionFromSSD, bayName)
	}
	return null
}

/**
 * Creates an LNode reference in the Bay structure
 * @param doc The XML document
 * @param lnodeTemplate The LNode template
 * @param functionFromSSD The function template
 * @param iedName The IED name
 * @param lDeviceInst The LDevice instance
 * @returns The Insert edit for creating the LNode
 */
function createLNodeInBay(
	doc: Document,
	lnodeTemplate: LNodeTemplate,
	functionFromSSD: ConductingEquipmentTemplate | FunctionTemplate,
	iedName: string,
	lDeviceInst: string
): Insert {
	const bayName = bayTypesStore.selectedBayType
	if (!bayName) {
		throw new Error('No bay type selected')
	}

	const bayElement = getBayElement(doc, bayName)
	const lNodeElement = doc.createElement('LNode')

	lNodeElement.setAttribute('iedName', iedName)
	lNodeElement.setAttribute('ldInst', lDeviceInst)
	lNodeElement.setAttribute('lnClass', lnodeTemplate.lnClass)
	lNodeElement.setAttribute('lnInst', getNextLNodeInstance(bayElement, lnodeTemplate.lnClass))
	lNodeElement.setAttribute('uuid', uuidv4())

	// Find the parent element (Function or ConductingEquipment)
	let parentElement: Element | null = null
	if ('eqFunctions' in functionFromSSD) {
		// For conducting equipment, find the equipment element
		parentElement = bayElement.querySelector(
			`ConductingEquipment[name="${functionFromSSD.name}"]`
		)
	} else {
		// For functions, find the function element
		parentElement = bayElement.querySelector(
			`Function[name="${functionFromSSD.name}"]`
		)
	}

	if (!parentElement) {
		throw new Error(
			`Parent element for ${functionFromSSD.name} not found in bay`
		)
	}

	return {
		parent: parentElement,
		node: lNodeElement,
		reference: null
	}
}

/**
 * Assigns an LNode from SSD to an AccessPoint in the SCD
 * This creates the LDevice structure in the IED and links it to the Bay structure
 * All edits are collected and committed as a single complex edit array
 * 
 * @param functionFromSSD The function or conducting equipment template from SSD
 * @param lnodeTemplate The specific LNode template to assign
 * @param iedName The IED name to assign to
 * @param apName The AccessPoint name to assign to
 */
export function assignLNodeToAccessPoint(
	functionFromSSD: ConductingEquipmentTemplate | FunctionTemplate,
	lnodeTemplate: LNodeTemplate,
	iedName: string,
	apName: string
): void {
	const { doc, editor } = getDocumentAndEditor()
	const accessPoint = getAccessPoint(doc, iedName, apName)

	// Collect all edits to commit as a single complex edit
	const edits: Insert[] = []

	// Step 1: Add function to bay if it's not a conducting equipment function
	const functionBayEdit = addFunctionToBayIfNeeded(doc, functionFromSSD)
	if (functionBayEdit) {
		edits.push(functionBayEdit)
	}

	// Step 2: Create or get LDevice in AccessPoint
	const { lDevice, edit: lDeviceEdit } = getOrCreateLDevice(doc, accessPoint, functionFromSSD)
	if (lDeviceEdit) {
		edits.push(lDeviceEdit)
	}

	// Step 3: Create LN element in LDevice
	const lnElement = createLNElement(doc, lnodeTemplate, lDevice)
	const lnEdit: Insert = {
		parent: lDevice,
		node: lnElement,
		reference: null
	}
	edits.push(lnEdit)

	// Step 4: Create LNode reference in Bay structure
	const lDeviceInst = lDevice.getAttribute('inst')
	if (lDeviceInst) {
		const lNodeInBayEdit = createLNodeInBay(
			doc,
			lnodeTemplate,
			functionFromSSD,
			iedName,
			lDeviceInst
		)
		edits.push(lNodeInBayEdit)
	}

	// Step 5: Copy relevant DataType templates from SSD to SCD
	copyRelevantDataTypeTemplates(lnodeTemplate)

	// Commit all edits as a single complex edit
	editor.commit(edits, {
		title: `Assign LNode ${lnodeTemplate.lnClass} to ${apName}`
	})
}
