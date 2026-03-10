import type {
	ConductingEquipmentTemplate,
	FunctionTemplate,
	LNodeTemplate,
	LNodeType
} from '@/headless/common-types'
import { queryServer } from './server-element'
import type { EquipmentMatch } from '@/headless/domain/matching'
import { createElement } from '@oscd-plugins/core'

const LD0_INSTANCE = 'LD0'
const EXCLUDED_LNODE_CLASSES = new Set(['LGOS', 'LSVS'])

export function createLD0LNodeTemplates(
	lnodeTypes: LNodeType[]
): LNodeTemplate[] {
	const relevantLnodeTypes = lnodeTypes.filter(
		(lnodeType) =>
			lnodeType.lnClass.startsWith('L') &&
			!EXCLUDED_LNODE_CLASSES.has(lnodeType.lnClass)
	)

	const seenClasses = new Set<string>()
	const uniqueByClass = relevantLnodeTypes.filter((lnodeType) => {
		if (seenClasses.has(lnodeType.lnClass)) {
			return false
		}
		seenClasses.add(lnodeType.lnClass)
		return true
	})

	const orderedByClass = uniqueByClass.sort((a, b) => {
		if (a.lnClass === 'LLN0') return -1
		if (b.lnClass === 'LLN0') return 1
		return 0
	})

	return orderedByClass.map((lnodeType) => ({
		lnClass: lnodeType.lnClass,
		lnType: lnodeType.id,
		lnInst: lnodeType.lnClass === 'LLN0' ? '' : '1'
	}))
}

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
	const lDevice = createElement(doc, 'LDevice', { inst: lDeviceInst })
	return lDevice
}

export function createLD0Element(
	doc: XMLDocument,
	lnodeTypes: LNodeType[]
): Element {
	const ld0 = createElement(doc, 'LDevice', {
		inst: LD0_INSTANCE,
		ldName: LD0_INSTANCE
	})

	const ld0LNodeTemplates = createLD0LNodeTemplates(lnodeTypes)

	for (const lnodeTemplate of ld0LNodeTemplates) {
		const isLln0 = lnodeTemplate.lnClass === 'LLN0'
		const tagName = isLln0 ? 'LN0' : 'LN'

		const lnElement = createElement(doc, tagName, {
			lnClass: lnodeTemplate.lnClass,
			lnType: lnodeTemplate.lnType,
			lnInst: lnodeTemplate.lnInst
		})

		ld0.appendChild(lnElement)
	}

	return ld0
}
