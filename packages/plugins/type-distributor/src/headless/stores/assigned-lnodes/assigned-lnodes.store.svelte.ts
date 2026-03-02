import type {
	BayTypeWithTemplates,
	LNodeTemplate
} from '@/headless/common-types'
import { SvelteSet } from 'svelte/reactivity'
import { getAllLNodesWithParent } from '../bay-types.utils'
import { ssdImportStore } from '../ssd-import.store.svelte'
import { bayStore } from '../bay.store.svelte'
import { processEqFunctions, processFunctions } from './assigned-lnodes.helpers'

type LNodeKey = `${string}:${string}:${string}:${string}:${string}` // parentUuid:functionScopeUuid:lnClass:lnType:lnInst

class UseAssignedLNodesStore {
	private assignedIndex = new SvelteSet<LNodeKey>()

	private buildKey(
		parentUuid: string,
		lnode: LNodeTemplate,
		functionScopeUuid: string
	): LNodeKey {
		return `${parentUuid}:${functionScopeUuid}:${lnode.lnClass}:${lnode.lnType}:${lnode.lnInst}`
	}

	rebuild() {
		this.assignedIndex.clear()

		const scdBay = bayStore.scdBay
		if (!scdBay) return

		processFunctions(
			scdBay,
			this.assignedIndex,
			ssdImportStore.bayTypes ?? []
		)
		processEqFunctions(
			scdBay,
			this.assignedIndex,
			bayStore.equipmentMatches ?? []
		)
	}

	markAsAssigned(
		parentUuid: string,
		lNodes: LNodeTemplate[],
		functionScopeUuid?: string
	) {
		for (const lnode of lNodes) {
			const scope = functionScopeUuid ?? parentUuid
			const scopedKey = this.buildKey(parentUuid, lnode, scope)
			this.assignedIndex.add(scopedKey)
		}
	}

	isAssigned(
		parentUuid: string,
		lnode: LNodeTemplate,
		functionScopeUuid?: string
	): boolean {
		const scope = functionScopeUuid ?? parentUuid
		const scopedKey = this.buildKey(parentUuid, lnode, scope)
		return this.assignedIndex.has(scopedKey)
	}

	get hasConnections(): boolean {
		return this.assignedIndex.size > 0
	}

	areAllLNodesAssigned(bayTypeWithTemplates: BayTypeWithTemplates): boolean {
		const allLNodes = getAllLNodesWithParent(bayTypeWithTemplates)
		return allLNodes.every(({ parentUuid, functionScopeUuid, lnode }) =>
			this.isAssigned(parentUuid, lnode, functionScopeUuid)
		)
	}
}

export const assignedLNodesStore = new UseAssignedLNodesStore()
