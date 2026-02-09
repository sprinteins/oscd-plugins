import { pluginGlobalStore } from '@oscd-plugins/core-ui-svelte'
import type { LNodeTemplate } from '@/headless/common-types'
import { SvelteSet } from 'svelte/reactivity'

type LNodeKey = `${string}:${string}:${string}:${string}` // lDeviceInst:lnClass:lnType:lnInst

class UseAssignedLNodesStore {
	private assignedIndex = new SvelteSet<LNodeKey>()

	private buildKey(lDeviceInst: string, lnode: LNodeTemplate): LNodeKey {
		return `${lDeviceInst}:${lnode.lnClass}:${lnode.lnType}:${lnode.lnInst}`
	}

	rebuild() {
		const doc = pluginGlobalStore.xmlDocument
		if (!doc) {
			this.assignedIndex.clear()
			return
		}

		this.assignedIndex.clear()
		const lDevices = doc.querySelectorAll('IED > AccessPoint > Server > LDevice')

		for (const lDevice of lDevices) {
			const lnElements = lDevice.querySelectorAll(':scope > LN, :scope > LN0')

			for (const ln of lnElements) {
				const lnClass = ln.getAttribute('lnClass')
				const lnType = ln.getAttribute('lnType')
				const lnInst = ln.getAttribute('lnInst') ?? ''

				if (lnClass && lnType) {
					const key = `${lDevice.getAttribute('inst')}:${lnClass}:${lnType}:${lnInst}` as LNodeKey
					this.assignedIndex.add(key)
				}
			}
		}
	}

	markAsAssigned(lDeviceInst: string, lNodes: LNodeTemplate[]) {
		for (const lnode of lNodes) {
			this.assignedIndex.add(this.buildKey(lDeviceInst, lnode))
		}
	}

	isAssigned(lDeviceInst: string, lnode: LNodeTemplate): boolean {
		return this.assignedIndex.has(this.buildKey(lDeviceInst, lnode))
	}
}

export const assignedLNodesStore = new UseAssignedLNodesStore()