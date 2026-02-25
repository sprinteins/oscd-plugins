import type {
	ConductingEquipmentTemplate,
	FunctionTemplate
} from '@/headless/common-types'
import type { EquipmentMatch } from '@/headless/matching'
import { queryServer } from './server'

interface SourceFunctionParams {
	sourceFunction: ConductingEquipmentTemplate | FunctionTemplate
	equipmentUuid: string | undefined
	equipmentMatches: EquipmentMatch[]
}

function extractFunctionNames({
	sourceFunction,
	equipmentUuid,
	equipmentMatches
}: SourceFunctionParams): {
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
		const match = equipmentMatches.find(
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
	equipmentName: string | null
	functionName: string
} {
	if (!lDeviceInst.includes('_')) {
		return { equipmentName: null, functionName: lDeviceInst }
	}
	const [equipmentName, functionName] = lDeviceInst.split('_')
	return { equipmentName, functionName }
}

export function queryLDevice(
	server: Element,
	{ sourceFunction, equipmentUuid, equipmentMatches }: SourceFunctionParams
): Element | null {
	const { functionName, conductingEquipmentName } = extractFunctionNames({
		sourceFunction,
		equipmentUuid,
		equipmentMatches
	})
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
	{ sourceFunction, equipmentUuid, equipmentMatches }: SourceFunctionParams
): Element {
	const { functionName, conductingEquipmentName } = extractFunctionNames({
		sourceFunction,
		equipmentUuid,
		equipmentMatches
	})
	const lDeviceInst = generateLDeviceInst(
		functionName,
		conductingEquipmentName
	)
	const lDevice = doc.createElement('LDevice')
	lDevice.setAttribute('inst', lDeviceInst)
	return lDevice
}
