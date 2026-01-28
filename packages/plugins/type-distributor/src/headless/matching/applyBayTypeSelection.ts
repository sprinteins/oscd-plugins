import type { Insert, SetAttributes } from '@openscd/oscd-api'
import type { LNodeTemplate } from '@/headless/types'
import {
	ssdImportStore,
	bayTypesStore,
	equipmentMatchingStore,
	bayStore
} from '../stores'
import { insertDataTypeTemplatesInStages } from './scd-edits/data-types'
import { getOrCreateDataTypeTemplates } from './scd-edits/data-types/get-or-create-data-type-templates'
import { matchEquipment } from './matching'
import {
	createEqFunctionInsertEdits,
	createEquipmentUpdateEdits,
	createFunctionInsertEdits,
	updateBay
} from './scd-edits'
import { getDocumentAndEditor } from '@/headless/utils'

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

	const scdBay = bayStore.scdBay
	if (!scdBay) {
		throw new Error('No Bay selected in SCD')
	}

	const matches = matchEquipment(
		scdBay,
		bayType,
		equipmentMatchingStore.manualMatches
	)

	const edits: (Insert | SetAttributes)[] = []

	//TODO: This should only happen once the LNode is assigned later.
	const bayEdits = updateBay(scdBay, bayType)
	edits.push(bayEdits)

	const equipmentEdits = createEquipmentUpdateEdits(matches)
	edits.push(...equipmentEdits)

	const eqFunctionEdits = createEqFunctionInsertEdits(doc, matches)
	edits.push(...eqFunctionEdits)

	const functionEdits = createFunctionInsertEdits(doc, bayType, scdBay)
	edits.push(...functionEdits)

	// Get or create DataTypeTemplates once
	const { element: dataTypeTemplates, edit: dtsCreationEdit } = getOrCreateDataTypeTemplates(doc)

	// If DTS was created, add its creation edit
	if (dtsCreationEdit) {
		edits.push(dtsCreationEdit)
	}

	// First commit: all main edits (Bay, Equipment, Functions, DTS creation if needed)
	editor.commit(edits, {
		title: `Assign BayType "${bayType.name}" to Bay "${bayName}"`
	})

	// Collect all LNode templates
	const allLNodeTemplates: LNodeTemplate[] = []

	// From Equipment Functions
	for (const match of matches) {
		for (const eqFunctionTemplate of match.templateEquipment.eqFunctions) {
			allLNodeTemplates.push(...eqFunctionTemplate.lnodes)
		}
	}

	// From Bay Functions
	for (const functionType of bayType.functions) {
		const functionTemplate = ssdImportStore.getFunctionTemplate(
			functionType.templateUuid
		)
		if (functionTemplate) {
			allLNodeTemplates.push(...functionTemplate.lnodes)
		}
	}

	// Insert data type templates in stages with squash
	insertDataTypeTemplatesInStages(doc, dataTypeTemplates, allLNodeTemplates, editor)
}
