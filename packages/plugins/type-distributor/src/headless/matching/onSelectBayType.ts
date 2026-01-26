import type { Insert, SetAttributes } from '@openscd/oscd-api'
import { ssdImportStore, bayTypesStore, equipmentMatchingStore } from '../stores'
import {
	getDocumentAndEditor,
	getBayElement
} from '../distribution/utils/document-helpers'
import { copyRelevantDataTypeTemplates } from '../distribution/data-types/copy-data-type-templates'
import { validateEquipmentMatch } from './validation'
import { matchEquipmentSequentially, matchEquipmentHybrid } from './matching'
import { createEquipmentUpdateEdits } from './equipment-updates'
import { createEqFunctionInsertEdits } from './eqfunction-creation'
import { createFunctionInsertEdits } from './function-creation'
import { pluginGlobalStore } from '@oscd-plugins/core-ui-svelte'

/**
 * Main function: Assigns a BayType to an SCD Bay
 * Validates equipment match, creates UUID relationships, copies EqFunctions and Functions
 * All changes are committed as a single atomic operation
 *
 * @param bayName The name of the Bay in the SCD to update
 * @param applyChanges If false, only validates and stores result (for UI preview). If true, commits changes.
 * @throws Error if validation fails or required data is missing
 */
export function onSelectBayType(bayName: string, applyChanges = false): void {
	console.log('[onSelectBayType] Called', { bayName, applyChanges })
	const { doc, editor } = getDocumentAndEditor()

	// Get selected BayType
	const selectedBayTypeName = bayTypesStore.selectedBayType
	console.log('[onSelectBayType] Selected bay type:', selectedBayTypeName)
	if (!selectedBayTypeName) {
		throw new Error('No BayType selected')
	}

	const bayType = ssdImportStore.bayTypes.find(
		(bay) => bay.uuid === selectedBayTypeName
	)
	console.log('[onSelectBayType] Found bay type:', bayType)

	if (!bayType) {
		throw new Error(`BayType "${selectedBayTypeName}" not found`)
	}

	// Get SCD Bay element
	const scdBay = getBayElement(doc, bayName)
	console.log('[onSelectBayType] SCD Bay element:', scdBay)

	// Step 1: Validate equipment match
	const validation = validateEquipmentMatch(scdBay, bayType)
	console.log('[onSelectBayType] Validation result:', validation)
	
	// Store validation result for UI
	// When applyChanges=true, don't clear manual matches as we need them
	equipmentMatchingStore.setValidationResult(validation, !applyChanges)
	
	// If validation indicates manual matching required, stop here and wait for user input
	if (validation.requiresManualMatching && !applyChanges) {
		console.log('[onSelectBayType] Manual matching required, waiting for user input')
		return
	}

	if (!validation.isValid) {
		throw new Error(
			`Equipment validation failed:\n${validation.errors.join('\n')}`
		)
	}

	// Step 2: Match equipment (automatic or manual)
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

	// Step 3: Create UUID update edits for equipment and Bay
	const updateEdits = createEquipmentUpdateEdits(matches, scdBay, bayType)
	edits.push(...updateEdits)

	// Step 4: Create EqFunction insert edits
	const eqFunctionEdits = createEqFunctionInsertEdits(doc, matches)
	edits.push(...eqFunctionEdits)

	// Step 5: Create Function insert edits and copy DataTypeTemplates
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
	console.log('[onSelectBayType] Committing edits, total:', edits.length)
	editor.commit(edits, {
		title: `Assign BayType "${bayType.name}" to Bay "${bayName}"`
	})
	console.log('[onSelectBayType] Edits committed successfully')
}
