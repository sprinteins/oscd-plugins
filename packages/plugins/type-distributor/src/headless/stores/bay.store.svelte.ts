import { getDocumentAndEditor } from '@/headless/utils'
import { pluginGlobalStore } from '@oscd-plugins/core-ui-svelte'
import { matchEquipment } from '@/headless/matching/matching'
import { ssdImportStore } from './ssd-import.store.svelte'
import { equipmentMatchingStore } from './equipment-matching.store.svelte'

class UseBayStore {
	selectedBay: string | null = $state<string | null>(null)
	selectedBayUuid = $state<string | null>(null)
	assignedBayTypeUuid = $derived.by(() => {
		if (!this.scdBay) return null
		pluginGlobalStore.editCount
		return this.scdBay.getAttribute('templateUuid') ?? null
	})
	pendingBayTypeApply = $state<string | null>(null)
	equipmentMatches = $derived.by(() => {
		if (!this.scdBay || !this.assignedBayTypeUuid) return []
		const bayType = ssdImportStore.bayTypes.find(
			(bt) => bt.uuid === this.assignedBayTypeUuid
		)
		if (!bayType) return []
		return matchEquipment(
			this.scdBay,
			bayType,
			equipmentMatchingStore.manualMatches
		)
	})

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