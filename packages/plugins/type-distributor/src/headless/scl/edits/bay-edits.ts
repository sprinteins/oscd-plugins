import type { SetAttributes } from '@openscd/oscd-api'
import type {
	EqFunctionTemplate,
	FunctionTemplate,
	LNodeTemplate
} from '@/headless/common-types'
import type { EquipmentMatch } from '@/headless/domain/matching'
import { bayStore } from '@/headless/stores'

type FindMatchingLNodeElementParams = {
	lNode: LNodeTemplate
	sourceFunction: EqFunctionTemplate | FunctionTemplate
	equipmentMatches: EquipmentMatch[]
	equipmentUuid?: string
	functionScopeUuid?: string
}

function findMatchingLNodeElement({
	lNode,
	sourceFunction,
	equipmentMatches,
	equipmentUuid,
	functionScopeUuid
}: FindMatchingLNodeElementParams): Element | null {
	const functionElements = queryFunctionElements({
		sourceFunction,
		equipmentMatches,
		equipmentUuid,
		functionScopeUuid
	})

	for (const functionElement of functionElements) {
		const matches = queryLNodeMatchesFromFunction(functionElement, lNode)
		const preferred = choosePreferredMatch(matches)
		if (preferred) return preferred
	}

	return null
}

type QueryFunctionElementsParams = {
	sourceFunction: EqFunctionTemplate | FunctionTemplate
	equipmentMatches: EquipmentMatch[]
	equipmentUuid?: string
	functionScopeUuid?: string
}

function queryFunctionElements({
	sourceFunction,
	equipmentUuid,
	equipmentMatches,
	functionScopeUuid
}: QueryFunctionElementsParams): Element[] {
	if (equipmentUuid) {
		const matchFromStore = equipmentMatches.find(
			(m) => m.bayTypeEquipment.uuid === equipmentUuid
		)
		if (!matchFromStore) return []

		const duplicateNames = Array.from(
			matchFromStore.scdElement.querySelectorAll(
				`EqFunction[name="${sourceFunction.name}"]`
			)
		)

		if (functionScopeUuid) {
			const duplicateNameTemplates =
				matchFromStore.templateEquipment.eqFunctions.filter(
					(ef) => ef.name === sourceFunction.name
				)
			const index = duplicateNameTemplates.findIndex(
				(ef) => ef.uuid === functionScopeUuid
			)
			if (index === -1) {
				console.warn(
					`[buildEditsForBayLNode] EqFunction template uuid "${functionScopeUuid}" not found for name "${sourceFunction.name}"`
				)
				return []
			}
			const element = duplicateNames[index]
			return element ? [element] : []
		}

		return duplicateNames
	}

	const scdBay = bayStore.scdBay
	if (!scdBay) {
		console.warn('No bay selected or bay not found in document')
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
	const { lnClass, lnType, lnInst } = lNode

	const selector = `LNode[lnClass="${lnClass}"][lnType="${lnType}"][lnInst="${lnInst}"]`
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

type UpdateBayLNodesParams = {
	lNodes: LNodeTemplate[]
	iedName: string
	sourceFunction: EqFunctionTemplate | FunctionTemplate
	equipmentUuid?: string
	equipmentMatches: EquipmentMatch[]
	functionScopeUuid?: string
}

export function buildEditsForBayLNode({
	lNodes,
	iedName,
	sourceFunction,
	equipmentUuid,
	equipmentMatches,
	functionScopeUuid
}: UpdateBayLNodesParams): SetAttributes[] {
	const edits: SetAttributes[] = []

	for (const lNode of lNodes) {
		const lnodeElement = findMatchingLNodeElement({
			lNode,
			sourceFunction,
			equipmentUuid,
			equipmentMatches,
			functionScopeUuid
		})
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
