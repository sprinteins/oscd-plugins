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
		const allLNodes =
			bayTypesStore.getAllLNodesWithParent(bayTypeWithTemplates)
		return allLNodes.every(({ parentUuid, lnode }) =>
			this.isAssigned(parentUuid, lnode)
		)
	}
}

export const assignedLNodesStore = new UseAssignedLNodesStore()
