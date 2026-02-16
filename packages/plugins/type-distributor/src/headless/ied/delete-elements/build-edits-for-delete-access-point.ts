import type { Remove, SetAttributes } from '@openscd/oscd-api'
import { hasRemainingConnectionsAfterClearing } from '../check-bay-connections.helper'
import { bayStore } from '@/headless/stores'
import { queryMatchingBayLNode } from './delete-elements.helper'

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