import { pluginGlobalStore } from '@oscd-plugins/core-ui-svelte'
import type { LNodeTemplate } from '@/headless/common-types'

type LNodeKey = `${string}:${string}:${string}:${string}:${string}` // iedName:ldInst:lnClass:lnType:lnInst

class UseAssignedLNodesStore {
	private assignedIndex = $state<Set<LNodeKey>>(new Set())

	private buildKey(lnode: LNodeTemplate): LNodeKey {
		const iedName = lnode.iedName || ''
		const ldInst = lnode.lDeviceName || ''
		const key = `${iedName}:${ldInst}:${lnode.lnClass}:${lnode.lnType}:${lnode.lnInst}` as LNodeKey
		console.debug('[assignedLNodesStore] buildKey', {
			iedName,
			ldInst,
			lnClass: lnode.lnClass,
			lnType: lnode.lnType,
			lnInst: lnode.lnInst,
			key,
		})
		return key
	}

	rebuild() {
		const doc = pluginGlobalStore.xmlDocument
		if (!doc) {
			console.debug('[assignedLNodesStore] rebuild: no xmlDocument, clearing index')
			this.assignedIndex = new Set()
			return
		}

		const index = new Set<LNodeKey>()
		const lDevices = doc.querySelectorAll('IED > AccessPoint > Server > LDevice')
		console.debug('[assignedLNodesStore] rebuild: lDevices found', lDevices.length)

		for (const lDevice of lDevices) {
			// Get IED name and LDevice instance
			const ied = lDevice.closest('IED')
			const iedName = ied?.getAttribute('name') || ''
			const ldInst = lDevice.getAttribute('inst') || ''
		
			const lnElements = Array.from(lDevice.children).filter(
				(child) => child.localName === 'LN' || child.localName === 'LN0'
			)

			for (const ln of lnElements) {
				const lnClass = ln.getAttribute('lnClass')
				const lnType = ln.getAttribute('lnType')
				const lnInst = ln.getAttribute('lnInst') ?? ''

				if (lnClass && lnType) {
					const key = `${iedName}:${ldInst}:${lnClass}:${lnType}:${lnInst}` as LNodeKey
					console.debug('[assignedLNodesStore] rebuild: add key', {
						iedName,
						ldInst,
						lnClass,
						lnType,
						lnInst,
						key,
					})
					index.add(key)
				}
			}
		}

		console.debug('[assignedLNodesStore] rebuild: index size', index.size)
		this.assignedIndex = index
	}

	markAsAssigned(lNodes: LNodeTemplate[]) {
		console.debug('[assignedLNodesStore] markAsAssigned: input size', lNodes.length)
		const newIndex = new Set(this.assignedIndex)
		for (const lnode of lNodes) {
			const key = this.buildKey(lnode)
			console.debug('[assignedLNodesStore] markAsAssigned: add key', key)
			newIndex.add(key)
		}
		this.assignedIndex = newIndex
	}

	isAssigned(lnode: LNodeTemplate): boolean {
		const key = this.buildKey(lnode)
		const assigned = this.assignedIndex.has(key)
		console.debug('[assignedLNodesStore] isAssigned', { key, assigned })
		return assigned
	}
}

export const assignedLNodesStore = new UseAssignedLNodesStore()
