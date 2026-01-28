import { SvelteMap } from 'svelte/reactivity'
import type { ValidationResult } from '@/headless/matching/validation'

export type ManualEquipmentMatch = {
	scdEquipmentName: string
	scdEquipmentType: string
	templateEquipmentUuid: string | null
}

class UseEquipmentMatchingStore {
	validationResult = $state<ValidationResult | null>(null)
	manualMatches = new SvelteMap<string, string>()
	isManualMatchingExpanded = $state(false)

	setValidationResult(result: ValidationResult, clearMatches = true) {
		this.validationResult = result
		
		if (result.requiresManualMatching) {
			this.isManualMatchingExpanded = true
		}
		
		if (clearMatches) {
			this.manualMatches.clear()
		}
	}

	setManualMatch(scdEquipmentName: string, templateEquipmentUuid: string) {
		this.manualMatches.set(scdEquipmentName, templateEquipmentUuid)
	}

	clearManualMatches() {
		this.manualMatches.clear()
	}

	clearValidationResult() {
		this.validationResult = null
		this.manualMatches.clear()
		this.isManualMatchingExpanded = false
	}

	toggleManualMatching() {
		this.isManualMatchingExpanded = !this.isManualMatchingExpanded
	}

	// TODO: could maybe make this into a derived state if we set requiredCount as state too
	areAllManualMatchesSet(requiredCount: number): boolean {
		return this.manualMatches.size >= requiredCount
	}
}

export const equipmentMatchingStore = new UseEquipmentMatchingStore()
