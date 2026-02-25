import type { SetAttributes } from '@openscd/oscd-api'
import type {
	EqFunctionTemplate,
	FunctionTemplate,
	LNodeTemplate
} from '@/headless/common-types'
import type { EquipmentMatch } from '@/headless/matching'
import { bayStore } from '@/headless/stores'

type UpdateBayLNodesParams = {
	lNodes: LNodeTemplate[]
	iedName: string
	sourceFunction: EqFunctionTemplate | FunctionTemplate
	equipmentUuid?: string
	equipmentMatches: EquipmentMatch[]
}

function findMatchingLNodeElement(
	lNode: LNodeTemplate,
	sourceFunction: EqFunctionTemplate | FunctionTemplate,
	equipmentUuid: string | undefined,
	equipmentMatches: EquipmentMatch[]
): Element | null {
	const functionElements = queryFunctionElements(
		sourceFunction,
		equipmentUuid,
		equipmentMatches
	)

	for (const functionElement of functionElements) {
		const matches = queryLNodeMatchesFromFunction(functionElement, lNode)
		const preferred = choosePreferredMatch(matches)
		if (preferred) return preferred
	}

	return null
}

function queryFunctionElements(
	sourceFunction: EqFunctionTemplate | FunctionTemplate,
	equipmentUuid: string | undefined,
	equipmentMatches: EquipmentMatch[]
): Element[] {
	const scdBay = bayStore.scdBay
	if (!scdBay) {
		console.warn('No bay selected or bay not found in document')
		return []
	}

	if (equipmentUuid) {
		const matchFromStore = equipmentMatches.find(
			(m) => m.bayTypeEquipment.uuid === equipmentUuid
		)
		if (matchFromStore) {
			return Array.from(
				matchFromStore.scdElement.querySelectorAll(
					`EqFunction[name="${sourceFunction.name}"]`
				)
			)
		}

		return []
	}

	return Array.from(
		scdBay.querySelectorAll(
			`:scope > Function[name="${sourceFunction.name}"]`
		)
	)
}

function queryLNodeMatchesFromFunction(
	functionElement: Element,
	lNode: LNodeTemplate
): Element[] {
	const { lnType, lnInst } = lNode

	const selector = `LNode[lnType="${lnType}"][lnInst="${lnInst}"]`
	return Array.from(functionElement.querySelectorAll(selector))
}

function choosePreferredMatch(matches: Element[]): Element | null {
	if (matches.length === 0) return null
	const unassigned = matches.find((el) => !el.getAttribute('iedName'))
	return unassigned ?? matches[0]
}

function createSetIedNameEdit(
	element: Element,
	iedName: string
): SetAttributes {
	return {
		element,
		attributes: { iedName },
		attributesNS: {}
	}
}

export function buildEditsForBayLNode({
	lNodes,
	iedName,
	sourceFunction,
	equipmentUuid,
	equipmentMatches
}: UpdateBayLNodesParams): SetAttributes[] {
	const edits: SetAttributes[] = []

	for (const lNode of lNodes) {
		const lnodeElement = findMatchingLNodeElement(
			lNode,
			sourceFunction,
			equipmentUuid,
			equipmentMatches
		)

		if (!lnodeElement) {
			continue
		}

		const currentIedName = lnodeElement.getAttribute('iedName')
		if (currentIedName) {
			continue
		}
		edits.push(createSetIedNameEdit(lnodeElement, iedName))
	}

	return edits
}
