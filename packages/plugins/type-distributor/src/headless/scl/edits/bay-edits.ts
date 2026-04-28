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
	if (!scdBay) {
		return undefined
	}

	const generalEquipment = scdBay.querySelector(
		`:scope > GeneralEquipment[templateUuid="${geInstanceUuid}"]`
	)

	if (!generalEquipment) {
		console.warn(
			`GeneralEquipment with templateUuid ${geInstanceUuid} not found in selected bay`
		)
		return undefined
	}

	const eqFunc = generalEquipment.querySelector(
		`EqFunction[name="${eqFunctionName}"]`
	)

	if (!eqFunc) {
		console.warn(
			`EqFunction with name ${eqFunctionName} not found in GeneralEquipment ${generalEquipment.getAttribute('name')}`
		)
		return undefined
	}

	return eqFunc.getAttribute('uuid') ?? undefined
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
	functionElementUuid?: string
}

function findMatchingLNodeElement({
	lNode,
	sourceFunction,
	equipmentUuid,
	equipmentMatches,
	functionElementUuid
}: FindMatchingLNodeElementParams): Element | null {
	const functionElements = queryFunctionElements({
		sourceFunction,
		equipmentUuid,
		equipmentMatches,
		functionElementUuid
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
	functionElementUuid?: string
}

function queryFunctionElements({
	sourceFunction,
	equipmentUuid,
	equipmentMatches,
	functionElementUuid
}: QueryFunctionElementsParams): Element[] {
	const scdBay = bayStore.scdBay
	if (!scdBay) {
		console.warn('No bay selected or bay not found in document')
		return []
	}

	if (functionElementUuid) {
		const specific = scdBay.querySelector(`[uuid="${functionElementUuid}"]`)
		return specific ? [specific] : []
	}

	if (equipmentUuid) {
		const matchFromStore = equipmentMatches.find(
			(m) => m.bayTypeEquipment.uuid === equipmentUuid
		)
		if (!matchFromStore) return []
		return Array.from(
			matchFromStore.scdElement.querySelectorAll(
				`EqFunction[name="${sourceFunction.name}"]`
			)
		)
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
	functionElementUuid?: string
}

export function buildUpdatesForBayLNode({
	lNodes,
	iedName,
	sourceFunction,
	equipmentUuid,
	equipmentMatches,
	functionElementUuid
}: BuildUpdatesForBayLNodeParams): SetAttributes[] {
	const edits: SetAttributes[] = []

	for (const lNode of lNodes) {
		const lnodeElement = findMatchingLNodeElement({
			lNode,
			sourceFunction,
			equipmentUuid,
			equipmentMatches,
			functionElementUuid
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
