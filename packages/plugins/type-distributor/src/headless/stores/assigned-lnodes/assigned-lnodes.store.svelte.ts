import { pluginGlobalStore } from '@oscd-plugins/core-ui-svelte'
import type { LNodeTemplate } from '@/headless/common-types'

type LNodeKey = `${string}:${string}:${string}:${string}:${string}` // iedName:ldInst:lnClass:lnType:lnInst

class UseAssignedLNodesStore {
	private assignedIndex = $state<Set<LNodeKey>>(new Set())

	private buildKey(lnode: LNodeTemplate): LNodeKey {
		const iedName = lnode.iedName || ''
		const ldInst = lnode.lDeviceName || ''
		return `${iedName}:${ldInst}:${lnode.lnClass}:${lnode.lnType}:${lnode.lnInst}`
	}

	rebuild() {
		const doc = pluginGlobalStore.xmlDocument
		if (!doc) {
			this.assignedIndex = new Set()
			return
		}

		const index = new Set<LNodeKey>()
		const lDevices = doc.querySelectorAll('IED > AccessPoint > Server > LDevice')

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
					index.add(key)
				}
			}
		}

		this.assignedIndex = index
	}

	markAsAssigned(lNodes: LNodeTemplate[]) {
		const newIndex = new Set(this.assignedIndex)
		for (const lnode of lNodes) {
			newIndex.add(this.buildKey(lnode))
		}
		this.assignedIndex = newIndex
	}

	isAssigned(lnode: LNodeTemplate): boolean {
		return this.assignedIndex.has(this.buildKey(lnode))
	}
}

export const assignedLNodesStore = new UseAssignedLNodesStore()
