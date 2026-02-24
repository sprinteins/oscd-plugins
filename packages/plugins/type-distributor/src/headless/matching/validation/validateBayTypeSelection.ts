import {
	ssdImportStore,
	equipmentMatchingStore,
	bayStore,
	assignedLNodesStore
} from '@/headless/stores'
import type { ValidationResult } from './types'
import { validateEquipmentMatch } from './validation'

export function validateBayTypeSelection(bayName: string): ValidationResult {
	const selectedBayTypeName = ssdImportStore.selectedBayType
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

	if (
		assignedLNodesStore.hasConnections &&
		bayStore.assignedBayTypeUuid &&
		bayStore.assignedBayTypeUuid !== ssdImportStore.selectedBayType
	) {
		const result: ValidationResult = {
			isValid: false,
			errors: ['Cannot change Bay Type - LNode connections exist'],
			requiresManualMatching: false
		}
		equipmentMatchingStore.setValidationResult(result, true)
		return result
	}

	const validation = validateEquipmentMatch(scdBay, bayType)

	equipmentMatchingStore.setValidationResult(validation, true)

	return validation
}
