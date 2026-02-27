import {
	ssdImportStore,
	equipmentMatchingStore,
	bayStore,
	assignedLNodesStore
} from '@/headless/stores'
import { resolveMatchingContext } from '../resolve-matching-context'
import type { ValidationResult } from './types'
import { validateEquipmentMatch } from './validation'

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

	const validation = validateEquipmentMatch(scdBay, bayType)

	equipmentMatchingStore.setValidationResult(validation, true)

	return validation
}
