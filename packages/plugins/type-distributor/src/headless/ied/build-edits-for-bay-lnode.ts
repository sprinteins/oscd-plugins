import type { SetAttributes } from '@openscd/oscd-api'
import type {
	EqFunctionTemplate,
	FunctionTemplate,
	LNodeTemplate
} from '@/headless/common-types'
import { bayStore } from '@/headless/stores'
import { getDocumentAndEditor } from '../utils'

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
	if (equipmentUuid) {
		const match = bayStore.equipmentMatches.find(
			(m) => m.bayTypeEquipment.uuid === equipmentUuid
		)
		if (!match) return []

		const targetEquipment = match.scdElement
		return Array.from(
			targetEquipment.querySelectorAll(
				`EqFunction[name="${sourceFunction.name}"]`
			)
		)
	}

	const { doc } = getDocumentAndEditor()

	return Array.from(
		doc.querySelectorAll(
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
