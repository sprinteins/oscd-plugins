import { ssdImportStore, bayTypesStore, equipmentMatchingStore, bayStore } from '../../stores'
import type { ValidationResult } from './validation'
import { validateEquipmentMatch } from './validation'

export function validateBayTypeSelection(bayName: string): ValidationResult {
	const selectedBayTypeName = bayTypesStore.selectedBayType
	if (!selectedBayTypeName) {
		throw new Error('No BayType selected')
	}

	const bayType = ssdImportStore.bayTypes.find(
		(bay) => bay.uuid === selectedBayTypeName
	)

	if (!bayType) {
		throw new Error(`BayType "${selectedBayTypeName}" not found`)
	}

	const scdBay = bayStore.scdBay
	if (!scdBay) {
		throw new Error('No Bay selected in SCD')
	}

	const validation = validateEquipmentMatch(scdBay, bayType)
	
	equipmentMatchingStore.setValidationResult(validation, true)
	
	return validation
}
