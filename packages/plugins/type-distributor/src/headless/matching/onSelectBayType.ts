import type { Insert, SetAttributes } from '@openscd/oscd-api'
import { ssdImportStore, bayTypesStore } from '../stores'
import {
	getDocumentAndEditor,
	getBayElement
} from '../distribution/utils/document-helpers'
import { copyRelevantDataTypeTemplates } from '../distribution/data-types/copy-data-type-templates'
import { validateEquipmentMatch } from './validation'
import { matchEquipmentSequentially } from './matching'
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
 * @throws Error if validation fails or required data is missing
 */
export function onSelectBayType(bayName: string): void {
	const { doc, editor } = getDocumentAndEditor()

	// Get selected BayType
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

	// Get SCD Bay element
	const scdBay = getBayElement(doc, bayName)

	// Step 1: Validate equipment match
	const validation = validateEquipmentMatch(scdBay, bayType)
	if (!validation.isValid) {
		throw new Error(
			`Equipment validation failed:\n${validation.errors.join('\n')}`
		)
	}

	// Step 2: Match equipment sequentially
	const matches = matchEquipmentSequentially(scdBay, bayType)

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
	editor.commit(edits, {
		title: `Assign BayType "${bayType.name}" to Bay "${bayName}"`
	})
}
