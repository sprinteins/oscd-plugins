import type {
	ConductingEquipmentTemplate,
	FunctionTemplate
} from '@/headless/common-types'
import { bayStore } from '@/headless/stores/bay.store.svelte'

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
			(m) => m.bayTypeEquipment.uuid === equipmentUuid
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

export function parseLDeviceInst(lDeviceInst: string): {
	equipmentName: string
	functionName: string
} | null {
	const lastUnderscoreIndex = lDeviceInst.lastIndexOf('_')
	if (lastUnderscoreIndex === -1) {
		return { equipmentName: '', functionName: lDeviceInst }
	}

	const equipmentName = lDeviceInst.substring(0, lastUnderscoreIndex)
	const functionName = lDeviceInst.substring(lastUnderscoreIndex + 1)

	return { equipmentName, functionName }
}

export function getLDeviceInst(
	sourceFunction: ConductingEquipmentTemplate | FunctionTemplate,
	equipmentUuid?: string
): string {
	const { functionName, conductingEquipmentName } = extractFunctionNames(
		sourceFunction,
		equipmentUuid
	)
	return generateLDeviceInst(functionName, conductingEquipmentName)
}

export function queryLDevice(
	server: Element,
	sourceFunction: ConductingEquipmentTemplate | FunctionTemplate,
	equipmentUuid?: string
): Element | undefined {
	const { functionName, conductingEquipmentName } = extractFunctionNames(
		sourceFunction,
		equipmentUuid
	)
	const lDeviceInst = generateLDeviceInst(
		functionName,
		conductingEquipmentName
	)
	return (
		(server.querySelector(`LDevice[inst="${lDeviceInst}"]`) as Element) ||
		undefined
	)
}

export function createLDeviceElement(
	doc: XMLDocument,
	sourceFunction: ConductingEquipmentTemplate | FunctionTemplate,
	equipmentUuid?: string
): Element {
	const { functionName, conductingEquipmentName } = extractFunctionNames(
		sourceFunction,
		equipmentUuid
	)
	const lDeviceInst = generateLDeviceInst(
		functionName,
		conductingEquipmentName
	)
	const lDevice = doc.createElement('LDevice')
	lDevice.setAttribute('inst', lDeviceInst)
	return lDevice
}
