import { ssdImportStore, bayTypesStore, equipmentMatchingStore } from '../stores'
import type { ValidationResult } from './validation'
import { getDocumentAndEditor, getBayElement } from '../distribution/utils/document-helpers'
import { validateEquipmentMatch } from './validation'

/**
 * Validates a BayType selection for an SCD Bay
 * 
 * This function:
 * - Retrieves the selected BayType and SCD Bay
 * - Validates equipment match (counts and types)
 * - Stores validation result in equipmentMatchingStore for UI reactivity
 * - Clears any previous manual matches
 * 
 * @param bayName The name of the Bay in the SCD to validate
 * @returns ValidationResult containing validation status, errors, and manual matching requirements
 * @throws Error if BayType is not selected, not found, or Bay doesn't exist
 */
export function validateBayTypeSelection(bayName: string): ValidationResult {
	console.log('[validateBayTypeSelection] Called', { bayName })
	const { doc } = getDocumentAndEditor()

	// Get selected BayType
	const selectedBayTypeName = bayTypesStore.selectedBayType
	console.log('[validateBayTypeSelection] Selected bay type:', selectedBayTypeName)
	if (!selectedBayTypeName) {
		throw new Error('No BayType selected')
	}

	const bayType = ssdImportStore.bayTypes.find(
		(bay) => bay.uuid === selectedBayTypeName
	)
	console.log('[validateBayTypeSelection] Found bay type:', bayType)

	if (!bayType) {
		throw new Error(`BayType "${selectedBayTypeName}" not found`)
	}

	// Get SCD Bay element
	const scdBay = getBayElement(doc, bayName)
	console.log('[validateBayTypeSelection] SCD Bay element:', scdBay)

	// Validate equipment match
	const validation = validateEquipmentMatch(scdBay, bayType)
	console.log('[validateBayTypeSelection] Validation result:', validation)
	
	// Store validation result for UI and clear previous manual matches
	equipmentMatchingStore.setValidationResult(validation, true)
	
	return validation
}
