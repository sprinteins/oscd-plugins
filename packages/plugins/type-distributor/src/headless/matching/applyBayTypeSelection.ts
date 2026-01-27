import type { Insert, SetAttributes } from '@openscd/oscd-api'
import { ssdImportStore, bayTypesStore, equipmentMatchingStore } from '../stores'
import { getDocumentAndEditor, getBayElement } from '../distribution/utils/document-helpers'
import { copyRelevantDataTypeTemplates } from '../distribution/data-types/copy-data-type-templates'
import { validateEquipmentMatch } from './validation'
import { matchEquipmentSequentially, matchEquipmentHybrid, type EquipmentMatch } from './matching'
import { createEquipmentUpdateEdits } from './equipment-updates'
import { createEqFunctionInsertEdits } from './eqfunction-creation'
import { createFunctionInsertEdits } from './function-creation'

export function applyBayTypeSelection(bayName: string): void {
	const { doc, editor } = getDocumentAndEditor()

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
	
	// Store validation result for UI (preserve manual matches)
	equipmentMatchingStore.setValidationResult(validation, false)
	
	// Check if validation allows proceeding
	if (!validation.isValid && !validation.requiresManualMatching) {
		// Hard validation failure (not just requiring manual matching)
		throw new Error(
			`Equipment validation failed:\n${validation.errors.join('\n')}`
		)
	}

	// Match equipment (automatic or manual)
	let matches: EquipmentMatch[]
	if (validation.requiresManualMatching) {
		// Use hybrid matching: manual for ambiguous types, automatic for the rest
		matches = matchEquipmentHybrid(scdBay, bayType, equipmentMatchingStore.manualMatches, validation.ambiguousTypes || [])
	} else {
		// Use automatic sequential matching
		matches = matchEquipmentSequentially(scdBay, bayType)
	}

	// Collect all edits
	const edits: (Insert | SetAttributes)[] = []

	// Create UUID update edits for equipment and Bay
	const updateEdits = createEquipmentUpdateEdits(matches, scdBay, bayType)
	edits.push(...updateEdits)

	// Create EqFunction insert edits
	const eqFunctionEdits = createEqFunctionInsertEdits(doc, matches)
	edits.push(...eqFunctionEdits)

	// Create Function insert edits and copy DataTypeTemplates
	const functionEdits = createFunctionInsertEdits(doc, bayType, scdBay)
	edits.push(...functionEdits)

	// Copy DataTypeTemplates for EqFunction LNodes as well
	for (const match of matches) {
		for (const eqFunctionTemplate of match.templateEquipment.eqFunctions) {
			for (const lnodeTemplate of eqFunctionTemplate.lnodes) {
				copyRelevantDataTypeTemplates(lnodeTemplate)
			}
		}
	}

	// Commit all edits as a single atomic operation
	console.log('[applyBayTypeSelection] Committing edits, total:', edits.length)
	editor.commit(edits, {
		title: `Assign BayType "${bayType.name}" to Bay "${bayName}"`
	})
	console.log('[applyBayTypeSelection] Edits committed successfully')
}
