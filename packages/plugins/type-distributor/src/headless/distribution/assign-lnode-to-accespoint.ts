import { pluginGlobalStore } from '@oscd-plugins/core-ui-svelte'
import type {
	ConductingEquipmentTemplate,
	FunctionTemplate,
	LNodeTemplate
} from '../types'
import { addFunctionToBay } from './add-function-to-bay'
import { bayTypesStore } from '../stores'
import { createAndDispatchEditEvent } from '@oscd-plugins/core-api/plugin/v1'
import type { Insert } from '@openscd/oscd-api'

// Need to probably double check to sync doc and plugin doc

// We need to know which Function/Equipment this LNode belongs to in order to create the right references
export function assignLNodeToAccessPoint(
	functionFromSSD: ConductingEquipmentTemplate | FunctionTemplate,
	lNodeInsideTheFunctionThatIsSelected: LNodeTemplate,
	iedName: string,
	apName: string
): void {
	// document and host checks
	const doc = pluginGlobalStore.xmlDocument
	if (!doc) {
		throw new Error('No XML document loaded')
	}
	const host = pluginGlobalStore.host
	if (!host) {
		throw new Error('No host available in pluginGlobalStore')
	}

	// Get the AP to assign to
	const accessPoint = doc.querySelector(
		`IED[name="${iedName}"] > AccessPoint[name="${apName}"]`
	)
	if (!accessPoint) {
		throw new Error(`AccessPoint ${apName} not found in IED ${iedName}`)
	}

	// if the function has EqFunctions (ConductingEquipment)
	if ('eqFunctions' in functionFromSSD) {
	} else {
		const bayName = bayTypesStore.selectedBayType
		if (!bayName) {
			throw new Error('No bay type selected')
		}
		addFunctionToBay(functionFromSSD, bayName)
	}

	// create LDevice inside AccessPoint for a new Function if it does not exist
	const lDevice = getOrCreateLDeviceForFunction(
		doc,
		accessPoint,
		functionFromSSD,
	)

    // create LNode inside LDevice
    const lNodeElement = doc.createElement('LN') // LN0?
    lNodeElement.setAttribute('lnClass', lNodeInsideTheFunctionThatIsSelected.lnClass)
    lNodeElement.setAttribute('lnInst', "1") // this should count up depending on existing lnodes of the same class
    lNodeElement.setAttribute('lnType', lNodeInsideTheFunctionThatIsSelected.lnType)

    const edit: Insert = {
        parent: lDevice, // is this already there in the doc probably need to check that
        node: lNodeElement,
        reference: null
    }

    createAndDispatchEditEvent({
        host,
        edit
    })

    // TODO: Inside Bay
    
    // TODO: IF first time
    
    // TODO: DataTypeTemplates
}

function getOrCreateLDeviceForFunction(
	doc: Document,
	accessPoint: Element,
	functionFromSSD: ConductingEquipmentTemplate | FunctionTemplate,
): Element {
	let functionName = functionFromSSD.name
	let lDeviceInst = functionName

	if ('eqFunctions' in functionFromSSD) {
		const conductingEquipmentName = functionFromSSD.name
		functionName = functionFromSSD.eqFunctions[0].name // could there be multiple equip functions?
		lDeviceInst = `${conductingEquipmentName}_${functionName}`
	}

	// Check if LDevice for this Function already exists
	let lDevice = accessPoint.querySelector(`LDevice[inst="${lDeviceInst}"]`)
	if (!lDevice) {
		// Create new LDevice
		lDevice = doc.createElement('LDevice')
		lDevice.setAttribute('inst', lDeviceInst)

		const host = pluginGlobalStore.host
		if (!host) {
			throw new Error('No host available in pluginGlobalStore')
		}

		const edit: Insert = {
			parent: accessPoint,
			node: lDevice,
            reference: null
		}

		createAndDispatchEditEvent({
			host,
			edit
		})
	}

    return lDevice
}
