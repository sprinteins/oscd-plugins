import { ssdImportStore, bayTypesStore, equipmentMatchingStore } from '../stores'
import type { ValidationResult } from './validation'
import { getDocumentAndEditor, getBayElement } from '../distribution/utils/document-helpers'
import { validateEquipmentMatch } from './validation'

export function validateBayTypeSelection(bayName: string): ValidationResult {
	const { doc } = getDocumentAndEditor()

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

	const scdBay = getBayElement(doc, bayName)

	const validation = validateEquipmentMatch(scdBay, bayType)
	
	equipmentMatchingStore.setValidationResult(validation, true)
	
	return validation
}
