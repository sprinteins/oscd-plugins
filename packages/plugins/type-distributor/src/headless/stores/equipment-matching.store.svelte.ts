import type { ValidationResult } from '../matching/validation'

export type ManualEquipmentMatch = {
	scdEquipmentName: string // name attribute from SCD
	scdEquipmentType: string // type attribute from SCD
	templateEquipmentUuid: string | null // UUID of selected template
}

class UseEquipmentMatchingStore {
	// Validation result from latest bay type selection
	validationResult = $state<ValidationResult | null>(null)
	
	// Manual matches set by user - using Map but need to replace for reactivity
	manualMatches = $state<Map<string, string>>(new Map()) // scdEquipmentName -> templateEquipmentUuid
	
	// Whether manual matching UI is expanded
	isManualMatchingExpanded = $state(false)

	setValidationResult(result: ValidationResult, clearMatches = true) {
		this.validationResult = result
		
		// Auto-expand if manual matching is required
		if (result.requiresManualMatching) {
			this.isManualMatchingExpanded = true
		}
		
		// Only clear manual matches when explicitly requested (e.g., when changing bay types)
		// Don't clear when re-validating during apply
		if (clearMatches) {
			this.manualMatches = new Map()
			console.log('[equipmentMatchingStore] Manual matches cleared')
		}
	}

	setManualMatch(scdEquipmentName: string, templateEquipmentUuid: string) {
		// Create a new Map to trigger reactivity
		const newMatches = new Map(this.manualMatches)
		newMatches.set(scdEquipmentName, templateEquipmentUuid)
		this.manualMatches = newMatches
		console.log('[equipmentMatchingStore] Manual match set:', scdEquipmentName, '->', templateEquipmentUuid, 'Total:', this.manualMatches.size)
	}

	clearManualMatches() {
		this.manualMatches = new Map()
	}

	clearValidationResult() {
		this.validationResult = null
		this.manualMatches = new Map()
		this.isManualMatchingExpanded = false
		console.log('[equipmentMatchingStore] Validation result and matches cleared')
	}

	toggleManualMatching() {
		this.isManualMatchingExpanded = !this.isManualMatchingExpanded
	}

	// Check if all required manual matches are set
	areAllManualMatchesSet(requiredCount: number): boolean {
		const result = this.manualMatches.size >= requiredCount
		console.log('[equipmentMatchingStore] areAllManualMatchesSet:', result, this.manualMatches.size, '>=', requiredCount)
		return result
	}
}

export const equipmentMatchingStore = new UseEquipmentMatchingStore()
