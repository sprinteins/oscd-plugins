import { getDocumentAndEditor } from '@/headless/utils'
import type { EquipmentMatch } from '@/headless/matching/types'
import { pluginGlobalStore } from '@oscd-plugins/core-ui-svelte'

class UseBayStore {
	selectedBay: string | null = $state<string | null>(null)
	selectedBayUuid = $state<string | null>(null)
	assignedBayTypeUuid = $derived.by(() => {
		if (!this.scdBay) return null
		return this.scdBay.getAttribute('templateUuid') ?? null
	})
	pendingBayTypeApply = $state<string | null>(null)
	equipmentMatches: EquipmentMatch[] = $state<EquipmentMatch[]>([])

	scdBay = $derived.by(() => {
		if (!this.selectedBay) {
			return null
		}
		try {
			const { doc } = getDocumentAndEditor()
			const bay = getBayElement(doc, this.selectedBay)
			return bay
		} catch (error) {
			return null
		}
	})
}

export const bayStore = new UseBayStore()

function getBayElement(doc: Document, bayName: string): Element {
	const bayElement = doc.querySelector(`Bay[name="${bayName}"]`)
	if (!bayElement) {
		throw new Error(`Bay with name ${bayName} not found`)
	}
	return bayElement
}