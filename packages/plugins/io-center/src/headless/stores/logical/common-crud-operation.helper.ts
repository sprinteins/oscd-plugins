// CORE
import {
	createAndDispatchEditEvent,
	getAttributes
} from '@oscd-plugins/core-api/plugin/v1'
import { pluginGlobalStore } from '@oscd-plugins/core-ui-svelte'
// CONSTANTS
import { LOGICAL_KIND, PORTS_CONFIG_PER_CLASS } from '@/headless/constants'
// HELPERS
import { createRequiredLNodeType } from './required-element.helper'
// STORES
import { iedStore, pluginLocalStore } from '@/headless/stores'
// TYPES
import type {
	LogicalKind,
	RawLogical,
	LogicalConditionerClass,
	LogicalPhysicalClass,
	PortConfig,
	PortSide
} from '@/headless/stores'

//====== CREATE ======//

export async function createLogicals(params: {
	lnClass: LogicalConditionerClass | LogicalPhysicalClass
	desiredNumberOfLogicalToCreate: number
	numberOfPorts: number | null
	description: string | null
	prefix: string | null
}) {
	// initialization
	await iedStore.createIedRequiredElements()
	await createRequiredLNodeType(params.lnClass)

	const lDevice0 = iedStore.currentIedSubElements.lDevice
	if (!lDevice0) throw new Error('no lDevice0 element found')

	const currentLogicalOccurrence = lDevice0.querySelectorAll(
		`LN[lnClass="${params.lnClass}"]`
	).length

	const currentLnType = pluginLocalStore.rootSubElements.dataTypeTemplates
		?.querySelector(`LNodeType[lnClass="${params.lnClass}"]`)
		?.getAttribute('id')

	if (!currentLnType)
		throw new Error(`lnType with lnClass ${params.lnClass} not found!`)

	// payloads

	const basePayload = {
		lnClass: params.lnClass,
		lnType: currentLnType
	}

	const optionalPayload = {
		...(params.description && { desc: params.description }),
		...(params.prefix && { prefix: params.prefix })
	}

	const portsPayload = {
		...((params.lnClass === 'LPDO' || params.lnClass === 'LCIV') && {
			numberOfPorts: `${params.numberOfPorts}`
		})
	}

	// create logicals
	for (let i = 1; i <= params.desiredNumberOfLogicalToCreate; i++) {
		const attributes = {
			uuid: crypto.randomUUID(),
			inst: `${currentLogicalOccurrence + i}`,
			...basePayload,
			...optionalPayload,
			// TODO: convert to NSAttributes
			...portsPayload
		}

		pluginLocalStore.createElement({
			tagName: 'LN',
			attributes,
			parent: lDevice0
		})
	}
}

//====== READ =====//

export function getLogical<
	GenericLogical extends LogicalKind,
	GenericLogicalClass extends LogicalConditionerClass | LogicalPhysicalClass
>(params: {
	logicalKind: GenericLogical
	logicalClass: Array<GenericLogicalClass>
}): RawLogical<GenericLogicalClass>[] {
	const iedElement = iedStore.selectedIED?.element
	if (!iedElement) return []

	const lcQuery = params.logicalClass
		.map(
			(lcType) =>
				`AccessPoint > Server > LDevice[inst="LD0"] > LN[lnClass="${lcType}"]`
		)
		.join(',')

	const logicalElements = Array.from(iedElement.querySelectorAll(lcQuery))

	return logicalElements.map((logicalElement) => {
		const uuid = logicalElement.getAttribute('uuid')
		if (!uuid) throw new Error('LN uuid not found')

		const lnClass = logicalElement.getAttribute(
			'lnClass'
		) as GenericLogicalClass
		if (!lnClass) throw new Error('LN class not found')

		const inst = logicalElement.getAttribute('inst')
		if (!inst) throw new Error('LN instance not found')

		const lnType = logicalElement.getAttribute('lnType')
		if (!lnType) throw new Error('LN lnType not found')

		const numberOfPorts = logicalElement.getAttribute('numberOfPorts')

		const ports = getLogicalPortConfig({
			logicalKind: params.logicalKind,
			logicalElement,
			numberOfPorts,
			ldInst: 'LD0',
			lnUuid: uuid,
			lnClass,
			lnInst: inst
		})

		return {
			id: uuid,
			element: logicalElement,
			name: `${lnClass}-${inst}`,
			attributes: {
				uuid,
				lnClass,
				inst,
				lnType,
				desc: logicalElement.getAttribute('desc'),
				prefix: logicalElement.getAttribute('prefix'),
				numberOfPorts: logicalElement.getAttribute('numberOfPorts')
			},
			ports
		}
	})
}

//====== UPDATE ======//

export function updateLogical(
	logicalToEdit: RawLogical<LogicalConditionerClass | LogicalPhysicalClass>
) {
	const attributesEntries = Object.entries(logicalToEdit.attributes)

	for (const [attributeKey, attributeValue] of attributesEntries) {
		if (attributeValue) continue

		logicalToEdit.element.removeAttribute(attributeKey)
		delete logicalToEdit.attributes[
			attributeKey as keyof typeof logicalToEdit.attributes
		]
	}

	pluginGlobalStore.updateElement({
		element: logicalToEdit.element,
		attributes: logicalToEdit.attributes,
		attributesNS: {}
	})
}

//====== DELETE ======//

export function removeLogical(
	currentLogical: RawLogical<LogicalConditionerClass | LogicalPhysicalClass>
) {
	const host = pluginGlobalStore.host
	if (!host) throw new Error('Host not found!')

	const iedElement = iedStore.selectedIED?.element
	if (!iedElement) throw new Error('IED element not found!')

	const logicalToDelete = iedElement.querySelector(
		`LN[uuid="${currentLogical.id}"]`
	)

	if (!logicalToDelete)
		throw new Error(
			`Logical element with name ${currentLogical.attributes.lnClass}-${currentLogical.attributes.inst} not found!`
		)

	createAndDispatchEditEvent({
		host,
		edit: {
			node: logicalToDelete
		}
	})

	//Decrease instance attribute by 1 for any Logical that's after the target
	const remainingLogicals = Array.from(
		iedElement.querySelectorAll(
			`AccessPoint > Server > LDevice[inst="LD0"] > LN[lnClass="${currentLogical.attributes.lnClass}"]`
		)
	)

	const currentLogicalInstanceAsNumber = Number(
		currentLogical.attributes.inst
	)

	for (const logical of remainingLogicals.slice(
		currentLogicalInstanceAsNumber - 1
	)) {
		const currentLogicalInst = logical.getAttribute('inst')
		if (!currentLogicalInst) throw new Error('LN instance not found')

		createAndDispatchEditEvent({
			host,
			edit: {
				element: logical,
				attributes: {
					...getAttributes(logical),
					inst: `${Number(currentLogicalInst) - 1}`
				},
				attributesNS: {}
			}
		})
	}
}

//====== LOCAL HELPERS ======//

function sortPortsBySide(ports: PortConfig[]) {
	return ports.reduce(
		(acc, port) => {
			acc[port.side].push(port)
			return acc
		},
		{ left: [], right: [] } as Record<PortSide, PortConfig[]>
	)
}

function getLogicalPortConfig(params: {
	logicalKind: LogicalKind
	logicalElement: Element
	numberOfPorts: string | null
	ldInst: 'LD0'
	lnUuid: string
	lnClass: LogicalConditionerClass | LogicalPhysicalClass
	lnInst: string
}): PortConfig[] {
	const portConfigBySideWithUuids: Record<PortSide, PortConfig[]> = {
		left: [],
		right: []
	}
	let portConfigBySide = sortPortsBySide([
		...PORTS_CONFIG_PER_CLASS[params.lnClass]
	])

	if (params.numberOfPorts) {
		portConfigBySide = setMultiplePorts({
			logicalKind: params.logicalKind,
			numberOfPorts: Number(params.numberOfPorts),
			portsBySide: portConfigBySide
		})
	}

	for (const [side, ports] of Object.entries(portConfigBySide) as [
		PortSide,
		PortConfig[]
	][]) {
		for (const [index, port] of ports.entries()) {
			portConfigBySideWithUuids[side][index] = {
				...port,
				payload: {
					...port.payload,
					ldInst: params.ldInst,
					lnUuid: params.lnUuid,
					lnClass: params.lnClass,
					lnInst: params.lnInst
				}
			}

			if (params.logicalKind === 'conditioner') {
				const currentDoi = params.logicalElement.querySelector(
					`DOI[name=${port.name}-${index}]`
				)
				portConfigBySideWithUuids[side][index].payload.uuid =
					currentDoi?.getAttribute('uuid') || crypto.randomUUID()
			} else if (params.logicalKind === 'physical') {
				const query = `LNRef[ldInst="${params.ldInst}"][lnUuid="${params.lnUuid}"][lnClass="${params.lnClass}"][lnInst="${params.lnInst}"]${params.numberOfPorts ? `[order="${index}"]` : ''}`
				const currentLnRef =
					iedStore.selectedIED?.element?.querySelector(query)

				portConfigBySideWithUuids[side][index].payload.uuid =
					currentLnRef?.getAttribute('uuid') || crypto.randomUUID()
			}
		}
	}

	return [
		...portConfigBySideWithUuids.left,
		...portConfigBySideWithUuids.right
	]
}

function setMultiplePorts(params: {
	logicalKind: LogicalKind
	numberOfPorts: number
	portsBySide: Record<PortSide, PortConfig[]>
}) {
	if (params.logicalKind === LOGICAL_KIND.conditioner) {
		const initialRightPort = params.portsBySide.right[0]
		let rightPorts: PortConfig[] = []

		for (let i = 0; i <= Number(params.numberOfPorts); i++) {
			rightPorts = [
				...rightPorts,
				{
					...initialRightPort,
					index: i
				}
			]
		}
		return { left: params.portsBySide.left, right: rightPorts }
	}

	if (params.logicalKind === LOGICAL_KIND.physical) {
		const initialLeftPort = params.portsBySide.left[0]
		let leftPorts: PortConfig[] = []

		for (let i = 0; i < Number(params.numberOfPorts); i++) {
			leftPorts = [
				...leftPorts,
				{
					...initialLeftPort,
					index: i
				}
			]
		}
		return { left: leftPorts, right: params.portsBySide.right }
	}

	return { left: [], right: [] }
}
