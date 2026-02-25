import { SvelteMap } from 'svelte/reactivity'
import type { ValidationResult } from '@/headless/matching/validation'
import type { ConductingEquipmentTemplate } from '@/headless/common-types'
import type { TemplateCountMismatch } from '@/headless/matching/types'
import { ssdImportStore } from './ssd-import.store.svelte'

class UseEquipmentMatchingStore {
	validationResult = $state<ValidationResult | null>(null)
	manualMatches = new SvelteMap<string, string>()

	readonly templatesByType = $derived.by(() => {
		const selectedBayTypeUuid = ssdImportStore.selectedBayType
		const map = new Map<string, ConductingEquipmentTemplate[]>()
		if (!selectedBayTypeUuid) return map

		const bayType = ssdImportStore.bayTypes.find(
			(bt) => bt.uuid === selectedBayTypeUuid
		)
		if (!bayType) return map

		for (const ce of bayType.conductingEquipments) {
			const template = ssdImportStore.getConductingEquipmentTemplate(
				ce.templateUuid
			)
			if (template) {
				const existing = map.get(template.type) ?? []
				existing.push(template)
				map.set(template.type, existing)
			}
		}

		return map
	})

	readonly requiredTemplateCounts = $derived.by(() => {
		const selectedBayTypeUuid = ssdImportStore.selectedBayType
		const counts = new Map<string, number>()
		if (!selectedBayTypeUuid) return counts

		const bayType = ssdImportStore.bayTypes.find(
			(bt) => bt.uuid === selectedBayTypeUuid
		)
		if (!bayType) return counts

		for (const ce of bayType.conductingEquipments) {
			counts.set(ce.templateUuid, (counts.get(ce.templateUuid) ?? 0) + 1)
		}

		return counts
	})

	get selectedTemplateCounts() {
		const counts = new Map<string, number>()

		for (const templateUuid of this.manualMatches.values()) {
			counts.set(templateUuid, (counts.get(templateUuid) ?? 0) + 1)
		}

		return counts
	}

	readonly templateCountMismatch = $derived.by(() => {
		const mismatches: TemplateCountMismatch[] = []

		for (const [
			templateUuid,
			requiredCount
		] of this.requiredTemplateCounts.entries()) {
			const template =
				ssdImportStore.getConductingEquipmentTemplate(templateUuid)
			if (
				!template ||
				(this.templatesByType.get(template.type)?.length ?? 0) <= 1
			)
				continue

			const selectedCount =
				this.selectedTemplateCounts.get(templateUuid) ?? 0
			if (selectedCount !== requiredCount) {
				mismatches.push({
					templateUuid,
					required: requiredCount,
					selected: selectedCount
				})
			}
		}

		return mismatches
	})

	readonly templateCountsValid = $derived(
		this.templateCountMismatch.length === 0
	)

	setValidationResult(result: ValidationResult, clearMatches = true) {
		this.validationResult = result

		if (clearMatches) {
			this.manualMatches.clear()
		}
	}

	setMatch(equipmentName: string, templateUuid: string) {
		if (!templateUuid) {
			this.manualMatches.delete(equipmentName)
		} else {
			this.manualMatches.set(equipmentName, templateUuid)
		}
	}


	reset() {
		this.clearManualMatches()
		this.clearValidationResult()
	}

	clearManualMatches() {
		this.manualMatches.clear()
	}

	clearValidationResult() {
		this.validationResult = null
		this.manualMatches.clear()
	}
}

export const equipmentMatchingStore = new UseEquipmentMatchingStore()
