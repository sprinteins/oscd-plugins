import {
	ssdImportStore,
	equipmentMatchingStore,
	bayStore,
	assignedLNodesStore
} from '@/headless/stores'
import {
	resolveMatchingContext,
	validateEquipmentMatch
} from '@/headless/domain/matching'
import type { ValidationResult } from '@/headless/domain/matching'

export function validateBayType(): ValidationResult {
	const { scdBay, bayType } = resolveMatchingContext({
		selectedBayTypeUuid: ssdImportStore.selectedBayType,
		bayTypes: ssdImportStore.bayTypes,
		scdBay: bayStore.scdBay
	})

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

	const validation = validateEquipmentMatch({
		scdBay,
		bayType,
		conductingEquipmentTemplates:
			ssdImportStore.conductingEquipmentTemplates
	})

	equipmentMatchingStore.setValidationResult(validation, true)

	return validation
}
