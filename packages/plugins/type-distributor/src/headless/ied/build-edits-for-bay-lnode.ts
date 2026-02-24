import type { SetAttributes } from '@openscd/oscd-api'
import type {
	EqFunctionTemplate,
	FunctionTemplate,
	LNodeTemplate
} from '@/headless/common-types'
import { bayStore } from '@/headless/stores'

type UpdateBayLNodesParams = {
	lNodes: LNodeTemplate[]
	iedName: string
	sourceFunction: EqFunctionTemplate | FunctionTemplate
	equipmentUuid?: string
}

function findMatchingLNodeElement(
	lNode: LNodeTemplate,
	sourceFunction: EqFunctionTemplate | FunctionTemplate,
	equipmentUuid?: string
): Element | null {
	const functionElements = queryFunctionElements(
		sourceFunction,
		equipmentUuid
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
	equipmentUuid?: string
): Element[] {
	const scdBay = bayStore.scdBay
	if (!scdBay) {
		console.warn('No bay selected or bay not found in document')
		return []
	}

	if (equipmentUuid) {
		const matchFromStore = bayStore.equipmentMatches.find(
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
	equipmentUuid
}: UpdateBayLNodesParams): SetAttributes[] {
	const edits: SetAttributes[] = []

	for (const lNode of lNodes) {
		const lnodeElement = findMatchingLNodeElement(
			lNode,
			sourceFunction,
			equipmentUuid
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
