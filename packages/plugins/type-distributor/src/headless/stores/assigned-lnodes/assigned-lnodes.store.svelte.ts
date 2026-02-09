import { pluginGlobalStore } from '@oscd-plugins/core-ui-svelte'
import type { LNodeTemplate } from '@/headless/common-types'
import { SvelteSet } from 'svelte/reactivity'

type LNodeKey = `${string}:${string}:${string}` // lnClass:lnType:lnInst

class UseAssignedLNodesStore {
	private assignedIndex = new SvelteSet<LNodeKey>()

	private buildKey(lnode: LNodeTemplate): LNodeKey {
		return `${lnode.lnClass}:${lnode.lnType}:${lnode.lnInst}`
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
			const lnElements = Array.from(lDevice.children).filter(
				(child) => child.localName === 'LN' || child.localName === 'LN0'
			)

			for (const ln of lnElements) {
				const lnClass = ln.getAttribute('lnClass')
				const lnType = ln.getAttribute('lnType')
				const lnInst = ln.getAttribute('lnInst') ?? ''

				if (lnClass && lnType) {
					const key = `${lnClass}:${lnType}:${lnInst}` as LNodeKey
					this.assignedIndex.add(key)
				}
			}
		}
	}

	markAsAssigned(lNodes: LNodeTemplate[]) {
		for (const lnode of lNodes) {
			this.assignedIndex.add(this.buildKey(lnode))
		}
	}

	isAssigned(lnode: LNodeTemplate): boolean {
		return this.assignedIndex.has(this.buildKey(lnode))
	}
}

export const assignedLNodesStore = new UseAssignedLNodesStore()