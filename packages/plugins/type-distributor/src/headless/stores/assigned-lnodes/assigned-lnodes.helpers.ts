import type { EquipmentMatch } from '@/headless/matching'
import type { EqFunctionTemplate } from '@/headless/common-types'

type LNodeKey = `${string}:${string}:${string}:${string}:${string}` // parentUuid:functionScopeUuid:lnClass:lnType:lnInst

function processLNodesFromElement(
	element: Element,
	parentUuid: string,
	assignedIndex: Set<LNodeKey>,
	functionScopeUuid: string
): void {
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

export function processFunctions(
	scdBay: Element,
	assignedIndex: Set<LNodeKey>,
	bayTypes: Array<{ functions: Array<{ uuid: string; templateUuid: string }> }>
): void {
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

		processLNodesFromElement(func, parentUuid, assignedIndex, functionScopeUuid)
	}
}

export function processEqFunctions(
	scdBay: Element,
	assignedIndex: Set<LNodeKey>,
	equipmentMatches: EquipmentMatch[]
): void {
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
		const functionScopeUuid =
			equipmentMatch.templateEquipment.eqFunctions.find(
				(templateEqFunction: EqFunctionTemplate) =>
					templateEqFunction.name === eqFuncName
			)?.uuid ?? null

		if (!functionScopeUuid) {
			console.warn(
				`[AssignedLNodes] Could not resolve EqFunction template UUID for "${eqFuncName}" in equipment "${equipmentName}"`
			)
			continue
		}

		processLNodesFromElement(
			eqFunc,
			parentUuid,
			assignedIndex,
			functionScopeUuid
		)
	}
}
