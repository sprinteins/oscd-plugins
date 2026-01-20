import type { Insert } from '@openscd/oscd-api'
import type { ConductingEquipmentTemplate, LNodeTemplate } from '../../types'
import { bayTypesStore } from '../../stores'
import { getDocumentAndEditor, getAccessPoint } from '../utils/document-helpers'
import { getOrCreateLDevice } from '../elements/ldevice'
import { createLNInsertEdit } from '../elements/ln'
import { createLNodeInsertEdit } from '../elements/lnode'
import { createConductingEquipmentInsertEdit } from '../elements/conducting-equipment'
import { copyRelevantDataTypeTemplates } from '../data-types/copy-data-type-templates'

/**
 * Adds a ConductingEquipment to the Bay if needed
 * @param doc The XML document
 * @param conductingEquipmentTemplate The conducting equipment template
 * @returns The Insert edit if conducting equipment was created, null otherwise
 */
function addConductingEquipmentToBayIfNeeded(
	doc: Document,
	conductingEquipmentTemplate: ConductingEquipmentTemplate
): Insert | null {
	const bayName = bayTypesStore.selectedBayType
	if (!bayName) {
		throw new Error('No bay type selected')
	}
	return createConductingEquipmentInsertEdit(doc, conductingEquipmentTemplate, bayName)
}

/**
 * Assigns an LNode from a ConductingEquipment's EqFunction to an AccessPoint in the SCD
 * This creates the LDevice structure in the IED and links it to the ConductingEquipment in the Bay
 * All edits are collected and committed as a single complex edit array
 * 
 * @param conductingEquipmentTemplate The conducting equipment template from SSD
 * @param lnodeTemplate The specific LNode template to assign from the EqFunction
 * @param iedName The IED name to assign to
 * @param apName The AccessPoint name to assign to
 */
export function assignEqFunctionLNodeToAccessPoint(
	conductingEquipmentTemplate: ConductingEquipmentTemplate,
	lnodeTemplate: LNodeTemplate,
	iedName: string,
	apName: string
): void {
	const { doc, editor } = getDocumentAndEditor()
	const accessPoint = getAccessPoint(doc, iedName, apName)

	// Collect all edits to commit as a single complex edit
	const edits: Insert[] = []

    // TODO: We do not know yet how to match
	// Step 1: Add ConductingEquipment to bay if it doesn't exist
	const ceEdit = addConductingEquipmentToBayIfNeeded(doc, conductingEquipmentTemplate)
	if (ceEdit) {
		edits.push(ceEdit)
		// Temporarily add CE to document so LNode creation can find it
		ceEdit.parent.appendChild(ceEdit.node)
	}

    // TODO: These should be similar steps to normal function or LNode assignment
	// Step 2: Create or get LDevice in AccessPoint
	// For ConductingEquipment, the LDevice uses combined naming
	const { lDevice, edit: lDeviceEdit } = getOrCreateLDevice(doc, accessPoint, conductingEquipmentTemplate)
	if (lDeviceEdit) {
		edits.push(lDeviceEdit)
	}

	// Step 3: Create LN element in LDevice
	const lnEdit = createLNInsertEdit(doc, lnodeTemplate, lDevice)
	edits.push(lnEdit)

	// Step 4: Create LNode reference in ConductingEquipment
	const lDeviceInst = lDevice.getAttribute('inst')
	if (lDeviceInst) {
		const lnodeEdit = createLNodeInsertEdit(
			doc,
			lnodeTemplate,
			conductingEquipmentTemplate,
			iedName,
			lDeviceInst
		)
		edits.push(lnodeEdit)
	}

	// If we temporarily added CE, remove it now (the editor will add it properly)
	if (ceEdit) {
		ceEdit.node.parentElement?.removeChild(ceEdit.node)
	}

	// Step 5: Copy relevant DataType templates from SSD to SCD
	copyRelevantDataTypeTemplates(lnodeTemplate)

	// Commit all edits as a single complex edit
	const eqFunctionName = conductingEquipmentTemplate.eqFunctions[0]?.name || 'EqFunction'
	editor.commit(edits, {
		title: `Assign EqFunction LNode ${lnodeTemplate.lnClass} from ${conductingEquipmentTemplate.name} to ${apName}`
	})
}
