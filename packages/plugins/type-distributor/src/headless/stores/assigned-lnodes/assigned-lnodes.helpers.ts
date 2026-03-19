import type { EquipmentMatch } from '@/headless/domain/matching'
import type { EqFunctionTemplate } from '@/headless/common-types'

export type LNodeKey = `${string}:${string}:${string}:${string}:${string}` // parentUuid:functionScopeUuid:lnClass:lnType:lnInst

interface ProcessLNodesFromElementParams {
	element: Element
	parentUuid: string
	assignedIndex: Set<LNodeKey>
	functionScopeUuid: string
}

function processLNodesFromElement({
	element,
	parentUuid,
	assignedIndex,
	functionScopeUuid
}: ProcessLNodesFromElementParams): void {
	const lnodes = element.querySelectorAll('LNode[iedName]')

	for (const lnode of lnodes) {
		const lnClass = lnode.getAttribute('lnClass')
		const lnType = lnode.getAttribute('lnType')
		const lnInst = lnode.getAttribute('lnInst')

		if (lnClass && lnType) {
			const key =
				`${parentUuid}:${functionScopeUuid}:${lnClass}:${lnType}:${lnInst}` as LNodeKey
			assignedIndex.add(key)
		}
	}
}

interface ProcessFunctionsParams {
	scdBay: Element
	assignedIndex: Set<LNodeKey>
	bayTypes: Array<{
		functions: Array<{ uuid: string; templateUuid: string }>
	}>
}

export function processFunctions({
	scdBay,
	assignedIndex,
	bayTypes
}: ProcessFunctionsParams): void {
	const functions = scdBay.querySelectorAll(':scope > Function')

	for (const func of functions) {
		const functionName = func.getAttribute('name')
		const parentUuid = func.getAttribute('templateUuid')

		if (!parentUuid) {
			console.warn(
				`[AssignedLNodes] Function "${functionName}" has no templateUuid, skipping`
			)
			continue
		}

		let functionScopeUuid: string | null = null

		for (const bayType of bayTypes) {
			const functionInstances = bayType.functions ?? []
			const functionInstance = functionInstances.find(
				(instance) => instance.uuid === parentUuid
			)
			if (functionInstance) {
				functionScopeUuid = functionInstance.templateUuid
				break
			}
		}

		if (!functionScopeUuid) {
			functionScopeUuid = parentUuid
		}

		processLNodesFromElement({
			element: func,
			parentUuid,
			assignedIndex,
			functionScopeUuid
		})
	}
}

interface ProcessEqFunctionsParams {
	scdBay: Element
	assignedIndex: Set<LNodeKey>
	equipmentMatches: EquipmentMatch[]
}

export function processEqFunctions({
	scdBay,
	assignedIndex,
	equipmentMatches
}: ProcessEqFunctionsParams): void {
	const eqFunctions = scdBay.querySelectorAll(
		':scope > ConductingEquipment > EqFunction'
	)

	for (const eqFunc of eqFunctions) {
		const lnodes = eqFunc.querySelectorAll('LNode[iedName]')
		if (lnodes.length === 0) continue

		const equipment = eqFunc.parentElement
		if (!equipment || equipment.tagName !== 'ConductingEquipment') continue

		const equipmentName = equipment.getAttribute('name')
		const eqFuncName = eqFunc.getAttribute('name')

		if (!eqFuncName) {
			console.warn(
				`[AssignedLNodes] EqFunction in Equipment "${equipmentName}" missing name`
			)
			continue
		}

		const equipmentMatch = equipmentMatches.find(
			(match) => match.scdElement === equipment
		)

		if (!equipmentMatch) {
			console.warn(
				`[AssignedLNodes] Could not resolve equipment match for equipment "${equipmentName}"`
			)
			continue
		}

		const parentUuid = equipmentMatch.bayTypeEquipment.uuid
		const allScdEqFunctionsWithName = Array.from(
			equipment.querySelectorAll(
				`:scope > EqFunction[name="${eqFuncName}"]`
			)
		)
		const indexInScd = allScdEqFunctionsWithName.indexOf(eqFunc)
		const sameNameTemplates =
			equipmentMatch.templateEquipment.eqFunctions.filter(
				(f: EqFunctionTemplate) => f.name === eqFuncName
			)
		const functionScopeUuid = sameNameTemplates[indexInScd]?.uuid ?? null

		if (!functionScopeUuid) {
			console.warn(
				`[AssignedLNodes] Could not resolve EqFunction template UUID for "${eqFuncName}" in equipment "${equipmentName}"`
			)
			continue
		}

		processLNodesFromElement({
			element: eqFunc,
			parentUuid,
			assignedIndex,
			functionScopeUuid
		})
	}
}
