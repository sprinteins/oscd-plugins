import { SvelteSet } from 'svelte/reactivity'
import type {
	BayTypeWithTemplates,
	LNodeTemplate
} from '@/headless/common-types'
import { bayStore } from '../bay.store.svelte'
import { getAllLNodesWithParent } from '../bay-types.utils'
import { ssdImportStore } from '../ssd-import.store.svelte'
import {
	type LNodeKey,
	processEqFunctions,
	processFunctions
} from './assigned-lnodes.helpers'

interface BuildKeyParams {
	parentUuid: string
	lnode: LNodeTemplate
	functionScopeUuid: string
}

interface MarkAsAssignedParams {
	parentUuid: string
	lNodes: LNodeTemplate[]
	functionScopeUuid?: string
}

interface isAssignedParams {
	parentUuid: string
	lnode: LNodeTemplate
	functionScopeUuid?: string
}

class UseAssignedLNodesStore {
	private assignedIndex = new SvelteSet<LNodeKey>()

	private buildKey({
		parentUuid,
		lnode,
		functionScopeUuid
	}: BuildKeyParams): LNodeKey {
		return `${parentUuid}:${functionScopeUuid}:${lnode.lnClass}:${lnode.lnType}:${lnode.lnInst}`
	}

	rebuild() {
		this.assignedIndex.clear()

		const scdBay = bayStore.scdBay
		if (!scdBay) return

		processFunctions({
			scdBay,
			assignedIndex: this.assignedIndex,
			bayTypes: ssdImportStore.bayTypes ?? []
		})
		processEqFunctions({
			scdBay,
			assignedIndex: this.assignedIndex,
			equipmentMatches: bayStore.equipmentMatches ?? []
		})
	}

	markAsAssigned({
		parentUuid,
		lNodes,
		functionScopeUuid
	}: MarkAsAssignedParams): void {
		for (const lnode of lNodes) {
			const scope = functionScopeUuid ?? parentUuid
			const scopedKey = this.buildKey({
				parentUuid,
				lnode,
				functionScopeUuid: scope
			})
			this.assignedIndex.add(scopedKey)
		}
	}

	isAssigned({
		parentUuid,
		lnode,
		functionScopeUuid
	}: isAssignedParams): boolean {
		const scope = functionScopeUuid ?? parentUuid
		const scopedKey = this.buildKey({
			parentUuid,
			lnode,
			functionScopeUuid: scope
		})
		return this.assignedIndex.has(scopedKey)
	}

	get hasConnections(): boolean {
		return this.assignedIndex.size > 0
	}

	areAllLNodesAssigned(bayTypeWithTemplates: BayTypeWithTemplates): boolean {
		const allLNodes = getAllLNodesWithParent(bayTypeWithTemplates)
		return allLNodes.every(({ parentUuid, functionScopeUuid, lnode }) =>
			this.isAssigned({ parentUuid, lnode, functionScopeUuid })
		)
	}
}

export const assignedLNodesStore = new UseAssignedLNodesStore()
