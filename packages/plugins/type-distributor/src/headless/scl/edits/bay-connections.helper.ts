import type { Remove, SetAttributes } from '@openscd/oscd-api'
import { uuidToPrefix } from '../elements'

type ClearLNodeConnectionsParams = {
	document: Document
	lnElements: Element[]
	iedName: string
}

export function buildUpdatesForClearingLNodeConnections({
	document,
	lnElements,
	iedName
}: ClearLNodeConnectionsParams): (Remove | SetAttributes)[] {
	const clearedLNodes = new Set(
		Array.from(document.querySelectorAll('LNode')).filter(
			(lnode) =>
				lnode.getAttribute('iedName') === iedName &&
				lnElements.some((ln) => referencesLN(lnode, ln))
		)
	)
	const edits: (Remove | SetAttributes)[] = []
	const affectedBays = new Set<Element>()

	for (const lnode of clearedLNodes) {
		edits.push({
			element: lnode,
			attributes: { iedName: null, ldInst: null },
			attributesNS: {}
		})
		const bay = lnode.closest('Bay')
		if (bay) affectedBays.add(bay)
	}

	for (const bay of affectedBays) {
		const hasRemainingConnections = Array.from(
			bay.querySelectorAll('LNode[iedName]')
		).some((lnode) => {
			const name = lnode.getAttribute('iedName')
			return name && name !== 'None' && !clearedLNodes.has(lnode)
		})
		if (!hasRemainingConnections) {
			edits.push(...buildEditsForUnassigningBayTemplate(bay))
		}
	}

	return edits
}

function referencesLN(lnode: Element, ln: Element): boolean {
	if (
		lnode.getAttribute('lnClass') !== ln.getAttribute('lnClass') ||
		(lnode.getAttribute('lnInst') ?? '') !==
			(ln.getAttribute('inst') ?? '') ||
		(lnode.getAttribute('prefix') ?? '') !==
			(ln.getAttribute('prefix') ?? '')
	) {
		return false
	}

	// Malformed SCD: without an LDevice inst no LNode can reference this LN.
	const ldInst = ln.parentElement?.getAttribute('inst')
	if (!ldInst) return false
	const referencedLdInst = lnode.getAttribute('ldInst')
	if (referencedLdInst !== null) return referencedLdInst === ldInst

	// Older distributor-created LNodes store only iedName, not ldInst.
	const parent = lnode.parentElement
	const functionUuid = parent?.getAttribute('uuid')
	return (
		(parent?.localName === 'Function' ||
			parent?.localName === 'EqFunction') &&
		!!functionUuid &&
		ldInst.endsWith(`_${uuidToPrefix(functionUuid)}`)
	)
}

function buildEditsForUnassigningBayTemplate(
	bay: Element
): (Remove | SetAttributes)[] {
	const edits: (Remove | SetAttributes)[] = [
		{
			element: bay,
			attributes: { uuid: null, templateUuid: null },
			attributesNS: {}
		}
	]
	for (const equipment of bay.querySelectorAll(
		':scope > ConductingEquipment'
	)) {
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
			})
		}
		for (const eqFunction of equipment.querySelectorAll(
			':scope > EqFunction'
		)) {
			edits.push({ node: eqFunction })
		}
	}
	for (const element of bay.querySelectorAll(
		':scope > Function, :scope > GeneralEquipment'
	)) {
		edits.push({ node: element })
	}
	return edits
}
