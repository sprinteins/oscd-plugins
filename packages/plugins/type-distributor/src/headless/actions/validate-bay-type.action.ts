import {
	ssdImportStore,
	equipmentMatchingStore,
	bayStore,
	assignedLNodesStore
} from '@/headless/stores'
import { resolveMatchingContext } from '@/headless/domain/matching'
import type { ValidationResult } from '@/headless/domain/validation'
import { validateEquipmentMatch } from '@/headless/domain/validation'

export function validateBayTypeSelection(bayName: string): ValidationResult {
	const { scdBay, bayType } = resolveMatchingContext(
		ssdImportStore.selectedBayType,
		ssdImportStore.bayTypes,
		bayStore.scdBay
	)

	if (
		assignedLNodesStore.hasConnections &&
		bayStore.assignedBayTypeUuid &&
		bayStore.assignedBayTypeUuid !== ssdImportStore.selectedBayType
	) {
		const result: ValidationResult = {
			isValid: false,
			errors: ['Cannot change Bay Type - LNode connections exist'],
			countMismatchErrors: [],
			requiresManualMatching: false
		}
		equipmentMatchingStore.setValidationResult(result, true)
		return result
	}

	const validation = validateEquipmentMatch(
		scdBay,
		bayType,
		ssdImportStore.conductingEquipmentTemplates
	)

	equipmentMatchingStore.setValidationResult(validation, true)

	return validation
}
