import { pluginGlobalStore } from '@oscd-plugins/core-ui-svelte'
import { matchEquipmentForPersistedBay } from '@/headless/domain/matching'
import { getDocumentAndEditor } from '@/headless/utils'
import { equipmentMatchingStore } from './equipment-matching.store.svelte'
import { ssdImportStore } from './ssd-import.store.svelte'

class UseBayStore {
	selectedBay: string | null = $state<string | null>(null)
	selectedBayUuid = $state<string | null>(null)
	assignedBayTypeUuid = $derived.by(() => {
		if (!this.scdBay) return null
		pluginGlobalStore.editCount
		return this.scdBay.getAttribute('templateUuid') ?? null
	})

	manualMatchingConfirmed = $state(false)

	isReadyToApply = $derived.by(() => {
		if (this.assignedBayTypeUuid) return false
		if (!ssdImportStore.selectedBayType) return false

		const validation = equipmentMatchingStore.validationResult
		if (!validation) return false

		if (validation.isValid && !validation.requiresManualMatching) {
			return true
		}

		if (validation.requiresManualMatching && this.manualMatchingConfirmed) {
			return true
		}

		return false
	})

	equipmentMatches = $derived.by(() => {
		if (!this.scdBay || !this.assignedBayTypeUuid) return []
		const bayType = ssdImportStore.bayTypes.find(
			(bt) => bt.uuid === this.assignedBayTypeUuid
		)
		if (!bayType) return []
		return matchEquipmentForPersistedBay({
			scdBay: this.scdBay,
			bayType,
			conductingEquipmentTemplates:
				ssdImportStore.conductingEquipmentTemplates
		})
	})

	scdBay = $derived.by(() => {
		if (!this.selectedBay) {
			return null
		}
		try {
			const { doc } = getDocumentAndEditor()
			const bay = getBayElement(doc, this.selectedBay)
			return bay
		} catch (_error) {
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
