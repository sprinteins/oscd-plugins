import type {
	ConductingEquipmentTemplate,
	FunctionTemplate
} from '@/headless/common-types'
import { bayStore } from '@/headless/stores/bay.store.svelte'
import { queryServer } from './server'

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

		if (!conductingEquipmentName) {
			const ceElement = bayStore.scdBay?.querySelector(
				`ConductingEquipment[templateUuid="${equipmentUuid}"]`
			)
			if (ceElement) {
				conductingEquipmentName =
					ceElement.getAttribute('name') ?? undefined
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
	equipmentName: string | null
	functionName: string
} {
	if (!lDeviceInst.includes('_')) {
		return { equipmentName: null, functionName: lDeviceInst }
	}
	const [equipmentName, functionName] = lDeviceInst.split('_')
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
): Element | null {
	const { functionName, conductingEquipmentName } = extractFunctionNames(
		sourceFunction,
		equipmentUuid
	)
	const lDeviceInst = generateLDeviceInst(
		functionName,
		conductingEquipmentName
	)
	return server.querySelector(`LDevice[inst="${lDeviceInst}"]`)
}

export function queryLDeviceByInst(
	server: Element,
	inst: string
): Element | null {
	return server.querySelector(`LDevice[inst="${inst}"]`)
}

export function queryLDeviceFromAccessPoint(
	accessPoint: Element,
	lDeviceInst: string
): Element | null {
	const server = queryServer(accessPoint)
	if (!server) return null

	return queryLDeviceByInst(server, lDeviceInst)
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
