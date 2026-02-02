import type { SetAttributes } from '@openscd/oscd-api'
import type {
	EqFunctionTemplate,
	FunctionTemplate,
	LNodeTemplate
} from '@/headless/common-types'
import { getDocumentAndEditor } from '../utils'
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
	let functionElements: Element[] = []

	// EqFunctions are inside ConductingEquipment
	if (equipmentUuid) {
		const match = bayStore.equipmentMatches.find(
			(m) => m.templateEquipment.uuid === equipmentUuid
		)

		if (match) {
			const targetEquipment = match.scdElement
			const eqFunctions = Array.from(
				targetEquipment.querySelectorAll('EqFunction')
			)
			functionElements = eqFunctions.filter((eqFunc) => {
				const name = eqFunc.getAttribute('name')
				return name === sourceFunction.name
			})
		}
	} else {
		const functions = Array.from(
			scdBay.querySelectorAll(':scope > Function')
		)
		functionElements = functions.filter((func) => {
			const name = func.getAttribute('name')
			return name === sourceFunction.name
		})
	}

	for (const functionElement of functionElements) {
		const lnodeElements = Array.from(
			functionElement.querySelectorAll('LNode')
		)

		const matches = lnodeElements.filter((element) => {
			const lnClass = element.getAttribute('lnClass')
			const lnType = element.getAttribute('lnType')
			const lnInst = element.getAttribute('lnInst')

			return (
				lnClass === lNode.lnClass &&
				lnType === lNode.lnType &&
				lnInst === lNode.lnInst
			)
		})

		const unassignedMatch = matches.find(
			(element) => !element.getAttribute('iedName')
		)
		if (unassignedMatch) {
			return unassignedMatch
		}

		if (matches.length > 0) {
			return matches[0]
		}
	}

	return null
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
		edits.push({
			element: lnodeElement,
			attributes: {
				iedName
			},
			attributesNS: {}
		})
	}

	return edits
}
