import type { ConductingEquipmentTemplate, FunctionTemplate } from "../types"

export function generateLDeviceInst(
	functionName: string,
	conductingEquipmentName?: string
): string {
	if (conductingEquipmentName) {
		return `${conductingEquipmentName}_${functionName}`
	}
	return functionName
}

function getLDevice(server: Element, functionName: string, conductingEquipmentName?: string): Element | undefined {
  const lDeviceInst = generateLDeviceInst(functionName, conductingEquipmentName)
  return Array.from(server.children).find(
    (child) =>
      child.localName === "LDevice" && child.getAttribute("inst") === lDeviceInst,
  );
}

export function getOrCreateLDeviceElement(doc: XMLDocument, 	functionFromSSD: ConductingEquipmentTemplate | FunctionTemplate, server: Element): Element {
  let functionName = functionFromSSD.name
	let conductingEquipmentName: string | undefined

	if ('eqFunctions' in functionFromSSD) {
		conductingEquipmentName = functionFromSSD.name
		functionName = functionFromSSD.eqFunctions[0]?.name || functionName
	}

  const existingLDevice = getLDevice(server, functionName, conductingEquipmentName)
    if (existingLDevice) {
      return existingLDevice
    }

  const lDevice = doc.createElement("LDevice");
  const lDeviceInst = generateLDeviceInst(functionName, conductingEquipmentName);
  lDevice.setAttribute("inst", lDeviceInst);
  return lDevice;
}