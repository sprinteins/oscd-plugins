import type { ConductingEquipmentTemplate, FunctionTemplate } from "../../common-types"

function extractFunctionNames(sourceFunction: ConductingEquipmentTemplate | FunctionTemplate): {
	functionName: string
	conductingEquipmentName: string | undefined
} {
	let functionName = sourceFunction.name
	let conductingEquipmentName: string | undefined

	if ('eqFunctions' in sourceFunction) {
		conductingEquipmentName = sourceFunction.name
		functionName = sourceFunction.eqFunctions[0]?.name || functionName
	}

	return { functionName, conductingEquipmentName }
}

function generateLDeviceInst(
	functionName: string,
	conductingEquipmentName?: string
): string {
	if (conductingEquipmentName) {
		return `${conductingEquipmentName}_${functionName}`
	}
	return functionName
}

export function getExistingLDevice(
	server: Element, 
	sourceFunction: ConductingEquipmentTemplate | FunctionTemplate
): Element | undefined {
	const { functionName, conductingEquipmentName } = extractFunctionNames(sourceFunction)
	const lDeviceInst = generateLDeviceInst(functionName, conductingEquipmentName)
	return Array.from(server.children).find(
		(child) =>
			child.localName === "LDevice" && child.getAttribute("inst") === lDeviceInst
	)
}

export function createLDeviceElement(
	doc: XMLDocument, 
	sourceFunction: ConductingEquipmentTemplate | FunctionTemplate
): Element {
	const { functionName, conductingEquipmentName } = extractFunctionNames(sourceFunction)
	const lDevice = doc.createElement("LDevice")
	const lDeviceInst = generateLDeviceInst(functionName, conductingEquipmentName)
	lDevice.setAttribute("inst", lDeviceInst)
	return lDevice
}