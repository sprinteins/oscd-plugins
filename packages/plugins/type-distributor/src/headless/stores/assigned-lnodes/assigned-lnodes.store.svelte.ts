import type {
	BayTypeWithTemplates,
	LNodeTemplate
} from '@/headless/common-types'
import { SvelteSet } from 'svelte/reactivity'
import { bayTypesStore } from '../bay-types.store.svelte'
import { bayStore } from '../bay.store.svelte'
import { processEqFunctions, processFunctions } from './assigned-lnodes.helpers'

type LNodeKey = `${string}:${string}:${string}:${string}` // parentUuid:lnClass:lnType:lnInst

class UseAssignedLNodesStore {
	private assignedIndex = new SvelteSet<LNodeKey>()

	private buildKey(parentUuid: string, lnode: LNodeTemplate): LNodeKey {
		return `${parentUuid}:${lnode.lnClass}:${lnode.lnType}:${lnode.lnInst}`
	}

	rebuild() {
		this.assignedIndex.clear()

		const scdBay = bayStore.scdBay
		if (!scdBay) return

		processFunctions(scdBay, this.assignedIndex)
		processEqFunctions(scdBay, this.assignedIndex, bayTypesStore.bayTypes)
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

	get hasConnections(): boolean {
		return this.assignedIndex.size > 0
	}

	areAllLNodesAssigned(bayTypeWithTemplates: BayTypeWithTemplates): boolean {
		for (const eqInstance of bayTypeWithTemplates.conductingEquipments) {
			const template =
				bayTypeWithTemplates.conductingEquipmentTemplates.find(
					(t) => t.uuid === eqInstance.templateUuid
				)
			if (template?.eqFunctions) {
				for (const eqFunc of template.eqFunctions) {
					for (const lnode of eqFunc.lnodes) {
						if (!this.isAssigned(eqInstance.uuid, lnode)) {
							return false
						}
					}
				}
			}
		}

		for (const funcInstance of bayTypeWithTemplates.functions) {
			const template = bayTypeWithTemplates.functionTemplates.find(
				(t) => t.uuid === funcInstance.templateUuid
			)
			if (template?.lnodes) {
				for (const lnode of template.lnodes) {
					if (!this.isAssigned(funcInstance.uuid, lnode)) {
						return false
					}
				}
			}
		}

		return true
	}
}

export const assignedLNodesStore = new UseAssignedLNodesStore()
