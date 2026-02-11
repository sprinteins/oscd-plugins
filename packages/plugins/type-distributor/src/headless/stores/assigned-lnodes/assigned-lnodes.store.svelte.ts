import type { LNodeTemplate } from '@/headless/common-types'
import { SvelteSet } from 'svelte/reactivity'
import { bayTypesStore } from '../bay-types.store.svelte'
import { bayStore } from '../bay.store.svelte'

type LNodeKey = `${string}:${string}:${string}:${string}` // parentUuid:lnClass:lnType:lnInst

class UseAssignedLNodesStore {
	private assignedIndex = new SvelteSet<LNodeKey>()

	private buildKey(parentUuid: string, lnode: LNodeTemplate): LNodeKey {
		return `${parentUuid}:${lnode.lnClass}:${lnode.lnType}:${lnode.lnInst}`
	}

	rebuild() {
		const scdBay = bayStore.scdBay
		if (!scdBay) {
			this.assignedIndex.clear()
			return
		}

		this.assignedIndex.clear()

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

			const lnodes = func.querySelectorAll('LNode[iedName]')
			for (const lnode of lnodes) {
				const lnClass = lnode.getAttribute('lnClass')
				const lnType = lnode.getAttribute('lnType')
				const lnInst = lnode.getAttribute('lnInst')

				if (lnClass && lnType) {
					const key =
						`${parentUuid}:${lnClass}:${lnType}:${lnInst}` as LNodeKey
					this.assignedIndex.add(key)
				}
			}
		}

		const eqFunctions = scdBay.querySelectorAll(
			':scope > ConductingEquipment > EqFunction'
		)
		for (const eqFunc of eqFunctions) {
			const lnodes = eqFunc.querySelectorAll('LNode[iedName]')
			if (lnodes.length === 0) continue

			const equipment = eqFunc.parentElement
			if (!equipment || equipment.tagName !== 'ConductingEquipment')
				continue

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

			for (const bayType of bayTypesStore.bayTypes) {
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

			for (const lnode of lnodes) {
				const lnClass = lnode.getAttribute('lnClass')
				const lnType = lnode.getAttribute('lnType')
				const lnInst = lnode.getAttribute('lnInst')

				if (lnClass && lnType) {
					const key =
						`${parentUuid}:${lnClass}:${lnType}:${lnInst}` as LNodeKey
					this.assignedIndex.add(key)
				}
			}
		}
	}

	markAsAssigned(parentUuid: string, lNodes: LNodeTemplate[]) {
		for (const lnode of lNodes) {
			const key = this.buildKey(parentUuid, lnode)
			this.assignedIndex.add(key)
		}
	}

	isAssigned(parentUuid: string, lnode: LNodeTemplate): boolean {
		const key = this.buildKey(parentUuid, lnode)
		const assigned = this.assignedIndex.has(key)
		return assigned
	}
}

export const assignedLNodesStore = new UseAssignedLNodesStore()
