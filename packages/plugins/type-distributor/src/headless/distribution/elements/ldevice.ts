import type { Insert } from '@openscd/oscd-api'
import type { ConductingEquipmentTemplate, FunctionTemplate } from '../../types'

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

/**
 * Creates an LDevice element with proper attributes
 * @param doc The XML document
 * @param functionFromSSD The function or conducting equipment template
 * @returns The created LDevice element
 */
export function createLDeviceElement(
	doc: Document,
	functionFromSSD: ConductingEquipmentTemplate | FunctionTemplate
): Element {
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

	const lDevice = doc.createElement('LDevice')
	lDevice.setAttribute('inst', lDeviceInst)

	return lDevice
}

/**
 * Creates or gets existing LDevice for a function
 * @param doc The XML document
 * @param accessPoint The access point element
 * @param functionFromSSD The function or conducting equipment template
 * @returns Object containing the LDevice element and optional Insert edit if created
 */
export function getOrCreateLDevice(
	doc: Document,
	accessPoint: Element,
	functionFromSSD: ConductingEquipmentTemplate | FunctionTemplate
): { lDevice: Element; edit: Insert | null } {
	const lDevice = createLDeviceElement(doc, functionFromSSD)
	const lDeviceInst = lDevice.getAttribute('inst')
    if (!lDeviceInst) {
        throw new Error('LDevice inst attribute is missing')
    }

	// Check if LDevice already exists
	const existingLDevice = accessPoint.querySelector(`LDevice[inst="${lDeviceInst}"]`)
	
	if (existingLDevice) {
		return { lDevice: existingLDevice, edit: null }
	}

	// Get or create Server element
	let server = accessPoint.querySelector('Server')
	if (!server) {
		server = doc.createElement('Server')
		accessPoint.appendChild(server)
	}

	// Create insert edit for new LDevice
	const edit: Insert = {
		parent: server,
		node: lDevice,
		reference: null
	}

	return { lDevice, edit }
}
