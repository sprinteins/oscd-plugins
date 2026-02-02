import type {
	ConductingEquipmentTemplate,
	FunctionTemplate
} from '../../common-types'
import { bayStore } from '../../stores/bay.store.svelte'

function extractFunctionNames(
	sourceFunction: ConductingEquipmentTemplate | FunctionTemplate,
	equipmentUuid?: string
): {
	functionName: string
	conductingEquipmentName: string | undefined
} {
	let functionName = sourceFunction.name
	let conductingEquipmentName: string | undefined

	if ('eqFunctions' in sourceFunction) {
		conductingEquipmentName = sourceFunction.name
		functionName = sourceFunction.eqFunctions[0]?.name || functionName
	}

	if (equipmentUuid) {
		const match = bayStore.equipmentMatches.find(
			(m) => m.templateEquipment.uuid === equipmentUuid
		)
		if (match) {
			const scdEquipmentName =
				match.scdElement.getAttribute('name') ?? undefined
			if (scdEquipmentName) {
				conductingEquipmentName = scdEquipmentName
			}
		}
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
	sourceFunction: ConductingEquipmentTemplate | FunctionTemplate,
	equipmentUuid?: string
): Element | undefined {
	const { functionName, conductingEquipmentName } =
		extractFunctionNames(sourceFunction, equipmentUuid)
	const lDeviceInst = generateLDeviceInst(
		functionName,
		conductingEquipmentName
	)
	return Array.from(server.children).find(
		(child) =>
			child.localName === 'LDevice' &&
			child.getAttribute('inst') === lDeviceInst
	)
}

export function createLDeviceElement(
	doc: XMLDocument,
	sourceFunction: ConductingEquipmentTemplate | FunctionTemplate,
	equipmentUuid?: string
): Element {
	const { functionName, conductingEquipmentName } =
		extractFunctionNames(sourceFunction, equipmentUuid)
	const lDevice = doc.createElement('LDevice')
	const lDeviceInst = generateLDeviceInst(
		functionName,
		conductingEquipmentName
	)
	lDevice.setAttribute('inst', lDeviceInst)
	return lDevice
}
