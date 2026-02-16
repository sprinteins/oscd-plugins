import type { LNodeTemplate } from "@/headless/common-types"
import { bayStore } from "@/headless/stores"
import type { Remove, SetAttributes } from "@openscd/oscd-api"
import { hasRemainingConnectionsAfterClearing } from "../check-bay-connections.helper"
import { queryMatchingBayLNode } from "./delete-elements.helper"

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
