import type { Remove, SetAttributes } from '@openscd/oscd-api'
import { hasRemainingConnectionsAfterClearing } from './check-bay-connections.helper'
import { parseLDeviceInst } from './elements'
import type { LNodeTemplate } from '@/headless/common-types'
import { bayStore } from '@/headless/stores'

function queryMatchingBayLNode(
	bay: Element,
	lNodeTemplate: LNodeTemplate,
	lDeviceInst: string,
	iedName: string
): Element | null {
	const parsed = parseLDeviceInst(lDeviceInst)
	if (!parsed) return null

	const { equipmentName, functionName } = parsed

	let targetFunction: Element | null = null

	if (equipmentName) {
		const equipment = bay.querySelector(
			`ConductingEquipment[name="${equipmentName}"]`
		)
		if (equipment) {
			targetFunction = equipment.querySelector(
				`:scope > EqFunction[name="${functionName}"]`
			)
		}
	} else {
		targetFunction = bay.querySelector(
			`:scope > Function[name="${functionName}"]`
		)
	}

	if (!targetFunction) return null

	const matchingLNode = targetFunction.querySelector(
		`:scope > LNode[lnClass="${lNodeTemplate.lnClass}"][lnType="${lNodeTemplate.lnType}"][lnInst="${lNodeTemplate.lnInst}"][iedName="${iedName}"]`
	)

	return matchingLNode
}

function collectLNodesFromAccessPoint(accessPoint: Element): Array<{
	lnode: Element
	lDeviceInst: string
}> {
	const lnodes: Array<{ lnode: Element; lDeviceInst: string }> = []
	const server = accessPoint.querySelector(':scope > Server')

	if (!server) return lnodes

	const lDevices = Array.from(server.querySelectorAll(':scope > LDevice'))

	for (const lDevice of lDevices) {
		const inst = lDevice.getAttribute('inst') || ''
		const lns = Array.from(lDevice.querySelectorAll(':scope > LN'))

		for (const ln of lns) {
			lnodes.push({
				lnode: ln,
				lDeviceInst: inst
			})
		}
	}

	return lnodes
}

export function buildEditsForDeleteAccessPoint(
	accessPoint: Element,
	iedName: string
): (Remove | SetAttributes)[] {
	const edits: (Remove | SetAttributes)[] = []
	const clearedBayLNodes = new Set<Element>()
	const selectedBay = bayStore.scdBay
	let willHaveRemainingConnections = false

	if (selectedBay) {
		const apLNodes = collectLNodesFromAccessPoint(accessPoint)
		for (const { lnode, lDeviceInst } of apLNodes) {
			const lnClass = lnode.getAttribute('lnClass')
			const lnType = lnode.getAttribute('lnType')
			const lnInst = lnode.getAttribute('lnInst')

			if (!lnClass || !lnType) continue

			const matchingBayLNodes = queryMatchingBayLNode(
				selectedBay,
				{ lnClass, lnType, lnInst: lnInst || '' },
				lDeviceInst,
				iedName
			)

			if (!matchingBayLNodes) continue

			clearedBayLNodes.add(matchingBayLNodes)

			edits.push({
				element: matchingBayLNodes,
				attributes: {
					iedName: null,
					ldInst: null
				},
				attributesNS: {}
			} as SetAttributes)
		}

		willHaveRemainingConnections = hasRemainingConnectionsAfterClearing(
			selectedBay,
			clearedBayLNodes
		)
	}

	const shouldClearTemplateUuid =
		clearedBayLNodes.size > 0 && !willHaveRemainingConnections

	if (shouldClearTemplateUuid) {
		edits.push({
			element: selectedBay,
			attributes: {
				templateUuid: null,
				originUuid: null
			},
			attributesNS: {}
		} as SetAttributes)
	}

	edits.push({
		node: accessPoint
	} as Remove)

	return edits
}

export function buildEditsForDeleteLNodeFromAccessPoint(
	iedName: string,
	accessPoint: Element,
	lDeviceInst: string,
	lNodeTemplate: LNodeTemplate
): (Remove | SetAttributes)[] {
	const edits: (Remove | SetAttributes)[] = []

	const selectedBay = bayStore.scdBay
	if (!selectedBay) {
		throw new Error('No bay selected')
	}

	const server = accessPoint.querySelector(':scope > Server')
	if (!server) {
		throw new Error(
			`Server not found in AccessPoint "${accessPoint.getAttribute('name')}" of IED "${iedName}"`
		)
	}

	const lDevice = server.querySelector(
		`:scope > LDevice[inst="${lDeviceInst}"]`
	)
	if (!lDevice) {
		throw new Error(
			`LDevice with inst "${lDeviceInst}" not found in AccessPoint "${accessPoint.getAttribute('name')}" of IED "${iedName}"`
		)
	}

	const lnElement = Array.from(lDevice.querySelectorAll(':scope > LN')).find(
		(ln) =>
			ln.getAttribute('lnClass') === lNodeTemplate.lnClass &&
			ln.getAttribute('lnType') === lNodeTemplate.lnType &&
			ln.getAttribute('lnInst') === lNodeTemplate.lnInst
	)

	if (!lnElement) {
		throw new Error(
			`LNode with lnClass="${lNodeTemplate.lnClass}", lnType="${lNodeTemplate.lnType}", lnInst="${lNodeTemplate.lnInst}" not found in LDevice "${lDeviceInst}"`
		)
	}

	const matchingBayLNode = queryMatchingBayLNode(
		selectedBay,
		lNodeTemplate,
		lDeviceInst,
		iedName
	)

	const clearedBayLNodes = new Set<Element>()

	if (!matchingBayLNode) return edits

	clearedBayLNodes.add(matchingBayLNode)

	edits.push({
		element: matchingBayLNode,
		attributes: {
			iedName: null,
			ldInst: null
		},
		attributesNS: {}
	} as SetAttributes)

	const willHaveRemainingConnections = hasRemainingConnectionsAfterClearing(
		selectedBay,
		clearedBayLNodes
	)

	const shouldClearTemplateUuid =
		clearedBayLNodes.size > 0 && !willHaveRemainingConnections

	if (shouldClearTemplateUuid) {
		edits.push({
			element: selectedBay,
			attributes: {
				templateUuid: null
			},
			attributesNS: {}
		} as SetAttributes)
	}

	const allLNs = Array.from(lDevice.querySelectorAll(':scope > LN'))
	const isLastLNode = allLNs.length === 1

	if (isLastLNode) {
		edits.push({
			node: lDevice
		} as Remove)
	} else {
		edits.push({
			node: lnElement
		} as Remove)
	}

	return edits
}
