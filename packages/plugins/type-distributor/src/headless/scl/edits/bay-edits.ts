import type { SetAttributes } from '@openscd/oscd-api'
import type {
	EqFunctionTemplate,
	FunctionTemplate,
	LNodeTemplate
} from '@/headless/common-types'
import type { EquipmentMatch } from '@/headless/domain/matching'
import { bayStore } from '@/headless/stores'

interface ResolveScdEqFunctionUuidParams {
	sourceFunction: EqFunctionTemplate | FunctionTemplate
	equipmentUuid: string | undefined
	equipmentMatches: EquipmentMatch[]
}

export function resolveScdEqFunctionUuid({
	sourceFunction,
	equipmentUuid,
	equipmentMatches
}: ResolveScdEqFunctionUuidParams): string | undefined {
	if (!equipmentUuid) return undefined

	const match = equipmentMatches.find(
		(m) => m.bayTypeEquipment.uuid === equipmentUuid
	)
	if (!match) return undefined

	const templateIndex = match.templateEquipment.eqFunctions.findIndex(
		(f: EqFunctionTemplate) => f.uuid === sourceFunction.uuid
	)
	if (templateIndex < 0) return undefined

	const eqFuncName = sourceFunction.name
	const scdEqFunctions = Array.from(
		match.scdElement.querySelectorAll(
			`:scope > EqFunction[name="${eqFuncName}"]`
		)
	)
	return scdEqFunctions[templateIndex]?.getAttribute('uuid') ?? undefined
}

export function resolveScdGeEqFunctionUuid(
	geInstanceUuid: string,
	eqFunctionName: string
): string | undefined {
	const scdBay = bayStore.scdBay
	if (!scdBay) return undefined

	const ge = scdBay.querySelector(
		`:scope > GeneralEquipment[templateUuid="${geInstanceUuid}"]`
	)
	return (
		ge
			?.querySelector(`EqFunction[name="${eqFunctionName}"]`)
			?.getAttribute('uuid') ?? undefined
	)
}

export function resolveScdFunctionUuid(
	functionInstanceUuid: string
): string | undefined {
	const scdBay = bayStore.scdBay
	if (!scdBay) return undefined

	const funcEl = scdBay.querySelector(
		`:scope > Function[templateUuid="${functionInstanceUuid}"]`
	)
	return funcEl?.getAttribute('uuid') ?? undefined
}

type FindMatchingLNodeElementParams = {
	lNode: LNodeTemplate
	sourceFunction: EqFunctionTemplate | FunctionTemplate
	equipmentMatches: EquipmentMatch[]
	equipmentUuid?: string
	scdEqFunctionUuid?: string
}

function findMatchingLNodeElement({
	lNode,
	sourceFunction,
	equipmentUuid,
	equipmentMatches,
	scdEqFunctionUuid
}: FindMatchingLNodeElementParams): Element | null {
	const functionElements = queryFunctionElements({
		sourceFunction,
		equipmentUuid,
		equipmentMatches,
		scdEqFunctionUuid
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
	scdEqFunctionUuid?: string
}

function queryFunctionElements({
	sourceFunction,
	equipmentUuid,
	equipmentMatches,
	scdEqFunctionUuid
}: QueryFunctionElementsParams): Element[] {
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
			if (scdEqFunctionUuid) {
				const specific = matchFromStore.scdElement.querySelector(
					`EqFunction[uuid="${scdEqFunctionUuid}"]`
				)
				return specific ? [specific] : []
			}
			return Array.from(
				matchFromStore.scdElement.querySelectorAll(
					`EqFunction[name="${sourceFunction.name}"]`
				)
			)
		}

		return []
	}

	// No equipmentUuid — could be a bay Function or a GE EqFunction
	if (scdEqFunctionUuid) {
		const specific = scdBay.querySelector(
			`EqFunction[uuid="${scdEqFunctionUuid}"]`
		)
		return specific ? [specific] : []
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

type BuildUpdatesForBayLNodeParams = {
	lNodes: LNodeTemplate[]
	iedName: string
	sourceFunction: EqFunctionTemplate | FunctionTemplate
	equipmentMatches: EquipmentMatch[]
	equipmentUuid?: string
	scdEqFunctionUuid?: string
}

export function buildUpdatesForBayLNode({
	lNodes,
	iedName,
	sourceFunction,
	equipmentUuid,
	equipmentMatches,
	scdEqFunctionUuid
}: BuildUpdatesForBayLNodeParams): SetAttributes[] {
	const edits: SetAttributes[] = []

	for (const lNode of lNodes) {
		const lnodeElement = findMatchingLNodeElement({
			lNode,
			sourceFunction,
			equipmentUuid,
			equipmentMatches,
			scdEqFunctionUuid
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
