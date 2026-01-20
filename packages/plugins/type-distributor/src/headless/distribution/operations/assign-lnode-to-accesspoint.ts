import type { Insert } from '@openscd/oscd-api'
import type { ConductingEquipmentTemplate, FunctionTemplate, LNodeTemplate } from '../../types'
import { bayTypesStore } from '../../stores'
import { getDocumentAndEditor, getAccessPoint } from '../utils/document-helpers'
import { getOrCreateLDevice } from '../elements/ldevice'
import { createLNInsertEdit } from '../elements/ln'
import { createLNodeInsertEdit } from '../elements/lnode'
import { addFunctionToBay } from './add-function-to-bay'
import { copyRelevantDataTypeTemplates } from '../data-types/copy-data-type-templates'

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
	const lnEdit = createLNInsertEdit(doc, lnodeTemplate, lDevice)
	edits.push(lnEdit)

	// Step 4: Create LNode reference in Bay structure
	const lDeviceInst = lDevice.getAttribute('inst')
	if (lDeviceInst) {
		const lnodeEdit = createLNodeInsertEdit(
			doc,
			lnodeTemplate,
			functionFromSSD,
			iedName,
			lDeviceInst
		)
		edits.push(lnodeEdit)
	}

	// Step 5: Copy relevant DataType templates from SSD to SCD
	copyRelevantDataTypeTemplates(lnodeTemplate)

	// Commit all edits as a single complex edit
	editor.commit(edits, {
		title: `Assign LNode ${lnodeTemplate.lnClass} to ${apName}`
	})
}
