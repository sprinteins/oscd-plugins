type LNodeKey = `${string}:${string}:${string}:${string}` // parentUuid:lnClass:lnType:lnInst

export function processLNodesFromElement(
	element: Element,
	parentUuid: string,
	assignedIndex: Set<LNodeKey>
): void {
	const lnodes = element.querySelectorAll('LNode[iedName]')

	for (const lnode of lnodes) {
		const lnClass = lnode.getAttribute('lnClass')
		const lnType = lnode.getAttribute('lnType')
		const lnInst = lnode.getAttribute('lnInst')

		if (lnClass && lnType) {
			const key =
				`${parentUuid}:${lnClass}:${lnType}:${lnInst}` as LNodeKey
			assignedIndex.add(key)
		}
	}
}

export function processFunctions(
	scdBay: Element,
	assignedIndex: Set<LNodeKey>
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

		processLNodesFromElement(func, parentUuid, assignedIndex)
	}
}

export function processEqFunctions(
	scdBay: Element,
	assignedIndex: Set<LNodeKey>,
	bayTypes: Array<{ conductingEquipments: Array<{ uuid: string }> }>
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
		const equipmentInstanceUuid = equipment.getAttribute('templateUuid')
		const eqFuncName = eqFunc.getAttribute('name')

		if (!equipmentInstanceUuid || !eqFuncName) {
			console.warn(
				`[AssignedLNodes] EqFunction "${eqFuncName}" in Equipment "${equipmentName}" missing templateUuid or name`
			)
			continue
		}

		let parentUuid: string | null = null

		for (const bayType of bayTypes) {
			const eqInstance = bayType.conductingEquipments.find(
				(ce) => ce.uuid === equipmentInstanceUuid
			)
			if (eqInstance) {
				parentUuid = equipmentInstanceUuid
				break
			}
		}

		if (!parentUuid) {
			console.warn(
				`[AssignedLNodes] Could not find BayType instance for equipment UUID: ${equipmentInstanceUuid}`
			)
			continue
		}

		processLNodesFromElement(eqFunc, parentUuid, assignedIndex)
	}
}
