import type { SetAttributes } from '@openscd/oscd-api'
import type {
	EqFunctionTemplate,
	FunctionTemplate,
	LNodeTemplate
} from '@/headless/common-types'
import { bayStore } from '@/headless/stores'

type UpdateBayLNodesParams = {
	scdBay: Element
	lNodes: LNodeTemplate[]
	iedName: string
	sourceFunction: EqFunctionTemplate | FunctionTemplate
	equipmentUuid?: string
}

function findMatchingLNodeElement(
	scdBay: Element,
	lNode: LNodeTemplate,
	sourceFunction: EqFunctionTemplate | FunctionTemplate,
	equipmentUuid?: string
): Element | null {
	const functionElements = getFunctionElements(
		scdBay,
		sourceFunction,
		equipmentUuid
	)

	for (const functionElement of functionElements) {
		const matches = getLNodeMatchesFromFunction(functionElement, lNode)
		const preferred = choosePreferredMatch(matches)
		if (preferred) return preferred
	}

	return null
}

function getFunctionElements(
	scdBay: Element,
	sourceFunction: EqFunctionTemplate | FunctionTemplate,
	equipmentUuid?: string
): Element[] {
	if (equipmentUuid) {
		const match = bayStore.equipmentMatches.find(
			(m) => m.templateEquipment.uuid === equipmentUuid
		)

		if (!match) return []

		const targetEquipment = match.scdElement
		const eqFunctions = Array.from(
			targetEquipment.querySelectorAll('EqFunction')
		)
		return eqFunctions.filter(
			(eqFunc) => eqFunc.getAttribute('name') === sourceFunction.name
		)
	}

	const functions = Array.from(scdBay.querySelectorAll(':scope > Function'))
	return functions.filter(
		(func) => func.getAttribute('name') === sourceFunction.name
	)
}

function getLNodeMatchesFromFunction(
	functionElement: Element,
	lNode: LNodeTemplate
): Element[] {
	const lnodeElements = Array.from(functionElement.querySelectorAll('LNode'))
	return lnodeElements.filter((element) => {
		const lnType = element.getAttribute('lnType')
		const lnInst = element.getAttribute('lnInst')

		return (
			lnType === lNode.lnType &&
			lnInst === lNode.lnInst
		)
	})
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

export function updateBayLNodeIedNames({
	scdBay,
	lNodes,
	iedName,
	sourceFunction,
	equipmentUuid
}: UpdateBayLNodesParams): SetAttributes[] {
	const edits: SetAttributes[] = []

	for (const lNode of lNodes) {
		const lnodeElement = findMatchingLNodeElement(
			scdBay,
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
