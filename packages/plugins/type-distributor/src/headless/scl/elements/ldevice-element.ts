import type {
	ConductingEquipmentTemplate,
	FunctionTemplate,
	LNodeTemplate,
	LNodeType
} from '@/headless/common-types'
import { queryServer } from './server-element'
import type { EquipmentMatch } from '@/headless/domain/matching'
import { createElement } from '@oscd-plugins/core'
import { createLNodeElementInIED } from './lnode-element'

const LD0_INSTANCE = 'LD0'
const EXCLUDED_LNODE_CLASSES = new Set(['LGOS', 'LSVS'])
const UUID_PREFIX_REGEX = /^[0-9a-f]{8}$/i

export function createLD0LNodeTemplates(
	lnodeTypes: LNodeType[]
): LNodeTemplate[] {
	const relevantLNodes = lnodeTypes.filter(
		(lnode) =>
			lnode.lnClass.startsWith('L') &&
			!EXCLUDED_LNODE_CLASSES.has(lnode.lnClass)
	)

	const uniqueLNodeMap = new Map<string, LNodeType>()
	for (const lnode of relevantLNodes) {
		if (!uniqueLNodeMap.has(lnode.lnClass)) {
			uniqueLNodeMap.set(lnode.lnClass, lnode)
		}
	}

	const distinctLNodeArray = Array.from(uniqueLNodeMap.values())

	distinctLNodeArray.sort((a, b) => {
		if (a.lnClass === 'LLN0') return -1
		if (b.lnClass === 'LLN0') return 1
		return 0
	})

	return distinctLNodeArray.map((lnode) => ({
		lnClass: lnode.lnClass,
		lnType: lnode.id,
		lnInst: lnode.lnClass === 'LLN0' ? '' : '1'
	}))
}

interface SourceFunctionParams {
	sourceFunction: ConductingEquipmentTemplate | FunctionTemplate
	equipmentUuid: string | undefined
	equipmentMatches: EquipmentMatch[]
	functionUuidOverride?: string
}

function extractFunctionNames({
	sourceFunction,
	equipmentUuid,
	equipmentMatches,
	functionUuidOverride
}: SourceFunctionParams): {
	functionName: string
	functionUuid: string
	conductingEquipmentName: string | undefined
} {
	let functionName = sourceFunction.name
	let functionUuid = sourceFunction.uuid
	let conductingEquipmentName: string | undefined

	if ('eqFunctions' in sourceFunction) {
		conductingEquipmentName = sourceFunction.name
		const firstEqFunction = sourceFunction.eqFunctions[0]
		if (firstEqFunction) {
			functionName = firstEqFunction.name
			if (!functionUuidOverride) {
				functionUuid = firstEqFunction.uuid
			}
		}
	}

	if (functionUuidOverride) {
		functionUuid = functionUuidOverride
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

	return { functionName, functionUuid, conductingEquipmentName }
}

export function uuidToPrefix(uuid: string): string {
	return uuid.replace(/-/g, '').substring(0, 8)
}

function generateLDeviceInst(
	functionName: string,
	functionUuid: string,
	conductingEquipmentName?: string
): string {
	const prefix = uuidToPrefix(functionUuid)

	if (conductingEquipmentName?.includes('_') || functionName.includes('_')) {
		console.warn(
			`Generated LDevice inst for function "${functionName}" with conducting equipment "${conductingEquipmentName}" contains underscores. This may lead to parsing issues later on. Consider renaming the function or equipment to avoid underscores.`
		)
	}

	if (conductingEquipmentName) {
		return `${conductingEquipmentName}_${functionName}_${prefix}`
	}
	return `${functionName}_${prefix}`
}

export function parseLDeviceInst(lDeviceInst: string): {
	equipmentName: string | null
	functionName: string
	functionPrefixUuid: string
} {
	const parts = lDeviceInst.split('_')
	const lastPart = parts[parts.length - 1]

	if (parts.length < 2 || !UUID_PREFIX_REGEX.test(lastPart)) {
		throw new Error(`Invalid LDevice inst format: ${lDeviceInst}`)
	}

	if (parts.length > 3) {
		console.warn(
			`Unexpected format for LDevice inst "${lDeviceInst}". Expected format is either FunctionName_UUID or EquipmentName_FunctionName_UUID. Equipment name will be parsed as everything before the last two segments.`
		)
	}

	const functionPrefixUuid = lastPart
	const functionName = parts[parts.length - 2]
	const equipmentName =
		parts.length >= 3 ? parts.slice(0, parts.length - 2).join('_') : null
	return {
		equipmentName,
		functionName,
		functionPrefixUuid
	}
}

export function queryLDevice(
	server: Element,
	{
		sourceFunction,
		equipmentUuid,
		equipmentMatches,
		functionUuidOverride
	}: SourceFunctionParams
): Element | null {
	const { functionName, functionUuid, conductingEquipmentName } =
		extractFunctionNames({
			sourceFunction,
			equipmentUuid,
			equipmentMatches,
			functionUuidOverride
		})
	const lDeviceInst = generateLDeviceInst(
		functionName,
		functionUuid,
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

interface CreateLDeviceElementParams extends SourceFunctionParams {
	lnodeTypes?: LNodeType[]
	iedName: string
}

function createLln0Element(
	doc: XMLDocument,
	lnodeTypes: LNodeType[]
): Element | null {
	const lln0Type = lnodeTypes.find((t) => t.lnClass === 'LLN0')
	if (!lln0Type) {
		console.warn(
			'[createLDeviceElement] No LLN0 type found in lnodeTypes — LDevice will be created without LN0'
		)
		return null
	}
	return createElement(doc, 'LN0', {
		lnClass: 'LLN0',
		lnType: lln0Type.id,
		lnInst: ''
	})
}

export function createLDeviceElement(
	doc: XMLDocument,
	{
		sourceFunction,
		equipmentUuid,
		equipmentMatches,
		lnodeTypes,
		iedName,
		functionUuidOverride
	}: CreateLDeviceElementParams
): Element {
	const { functionName, functionUuid, conductingEquipmentName } =
		extractFunctionNames({
			sourceFunction,
			equipmentUuid,
			equipmentMatches,
			functionUuidOverride
		})
	const inst = generateLDeviceInst(
		functionName,
		functionUuid,
		conductingEquipmentName
	)
	const ldName = `${iedName}_${inst}`
	const lDevice = createElement(doc, 'LDevice', { inst, ldName })

	if (lnodeTypes) {
		const ln0 = createLln0Element(doc, lnodeTypes)
		if (ln0) lDevice.appendChild(ln0)
	}

	return lDevice
}

export function createLD0Element(
	doc: XMLDocument,
	lnodeTypes: LNodeType[],
	apName: string,
	iedName: string
): Element {
	const inst = `${LD0_INSTANCE}_${apName}`
	const ldName = `${iedName}_${inst}`
	const ld0 = createElement(doc, 'LDevice', { inst, ldName })

	const ld0LNodeTemplates = createLD0LNodeTemplates(lnodeTypes)

	for (const lnodeTemplate of ld0LNodeTemplates) {
		const lnElement = createLNodeElementInIED(lnodeTemplate, doc)
		ld0.appendChild(lnElement)
	}

	return ld0
}
