import type { Insert, SetAttributes } from '@openscd/oscd-api'
import { ssdImportStore, bayTypesStore, equipmentMatchingStore } from '../stores'
import { getDocumentAndEditor, getBayElement } from '../distribution/utils/document-helpers'
import { copyRelevantDataTypeTemplates } from '../distribution/data-types/copy-data-type-templates'
import { matchEquipment, type EquipmentMatch } from './matching'
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

	const matches = matchEquipment(
		scdBay, 
		bayType, 
		equipmentMatchingStore.manualMatches
	)

	const edits: (Insert | SetAttributes)[] = []

	const updateEdits = createEquipmentUpdateEdits(matches, scdBay, bayType) // here also the Bay Update currently happens
	edits.push(...updateEdits)

	const eqFunctionEdits = createEqFunctionInsertEdits(doc, matches)
	edits.push(...eqFunctionEdits)

	const functionEdits = createFunctionInsertEdits(doc, bayType, scdBay)
	edits.push(...functionEdits)

	for (const match of matches) {
		for (const eqFunctionTemplate of match.templateEquipment.eqFunctions) {
			for (const lnodeTemplate of eqFunctionTemplate.lnodes) {
				copyRelevantDataTypeTemplates(lnodeTemplate)
			}
		}
	}

	editor.commit(edits, {
		title: `Assign BayType "${bayType.name}" to Bay "${bayName}"`
	})
}
