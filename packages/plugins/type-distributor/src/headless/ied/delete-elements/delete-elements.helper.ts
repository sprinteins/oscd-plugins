import type { LNodeTemplate } from '@/headless/common-types'
import type { SetAttributes } from '@openscd/oscd-api'
import { parseLDeviceInst } from '../elements'
import { hasRemainingConnectionsAfterClearing } from '../check-bay-connections.helper'

export function buildEditsForClearingBayLNodeConnections(
	selectedBay: Element,
	lNodeTemplates: LNodeTemplate[],
	iedName: string
): SetAttributes[] {
	const edits: SetAttributes[] = []
	const clearedBayLNodes = new Set<Element>()

	for (const template of lNodeTemplates) {
		if (!template.ldInst) continue

		const matchingBayLNode = queryMatchingBayLNode(
			selectedBay,
			{
				lnClass: template.lnClass,
				lnType: template.lnType,
				lnInst: template.lnInst,
                ldInst: template.ldInst
			},
			iedName
		)

		if (!matchingBayLNode) continue

		clearedBayLNodes.add(matchingBayLNode)

		edits.push({
			element: matchingBayLNode,
			attributes: {
				iedName: null,
				ldInst: null
			},
			attributesNS: {}
		} as SetAttributes)
	}

	const hasRemainingConnections = hasRemainingConnectionsAfterClearing(
		selectedBay,
		clearedBayLNodes
	)

	const shouldClearTemplateUuid =
		clearedBayLNodes.size > 0 && !hasRemainingConnections

	if (shouldClearTemplateUuid) {
		edits.push({
			element: selectedBay,
			attributes: {
				templateUuid: null
			},
			attributesNS: {}
		} as SetAttributes)
	}

	return edits
}

function queryMatchingBayLNode(
	bay: Element,
	lNodeTemplate: LNodeTemplate,
	iedName: string
): Element | null {
    const ldInst = lNodeTemplate.ldInst
    if (!ldInst) return null

	const parsed = parseLDeviceInst(ldInst)
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
