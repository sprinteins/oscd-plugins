import type { LNodeTemplate } from '@/headless/common-types'
import type { Remove, SetAttributes } from '@openscd/oscd-api'
import { parseLDeviceInst } from '../elements'

export function hasRemainingConnectionsAfterClearing(
	bay: Element,
	clearedLNodes: Set<Element>
): boolean {
	const allLNodes = Array.from(bay.querySelectorAll('LNode[iedName]'))
	const remainingLNodes = allLNodes.filter(
		(lnode) => !clearedLNodes.has(lnode)
	)
	return remainingLNodes.length > 0
}

export function buildUpdatesForClearingBayLNodeConnections(
	selectedBay: Element,
	lNodeTemplates: LNodeTemplate[],
	iedName: string
): (Remove | SetAttributes)[] {
	const edits: (Remove | SetAttributes)[] = []
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

	const shouldClearReferences =
		clearedBayLNodes.size > 0 && !hasRemainingConnections

	if (shouldClearReferences) {
		edits.push({
			element: selectedBay,
			attributes: {
				uuid: null,
				templateUuid: null
			},
			attributesNS: {}
		} as SetAttributes)

		const conductingEquipments = Array.from(
			selectedBay.querySelectorAll(':scope > ConductingEquipment')
		)

		for (const equipment of conductingEquipments) {
			if (
				equipment.hasAttribute('uuid') ||
				equipment.hasAttribute('templateUuid') ||
				equipment.hasAttribute('originUuid')
			) {
				edits.push({
					element: equipment,
					attributes: {
						uuid: null,
						templateUuid: null,
						originUuid: null
					},
					attributesNS: {}
				} as SetAttributes)
			}

			const eqFunctions = Array.from(
				equipment.querySelectorAll(':scope > EqFunction')
			)
			for (const eqFunction of eqFunctions) {
				edits.push({ node: eqFunction } as Remove)
			}
		}

		const functions = Array.from(
			selectedBay.querySelectorAll(':scope > Function')
		)
		for (const func of functions) {
			edits.push({ node: func } as Remove)
		}
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
