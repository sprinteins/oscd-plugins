import type { Insert, SetAttributes } from '@openscd/oscd-api'
import {
	ssdImportStore,
	bayTypesStore,
	equipmentMatchingStore
} from '../stores'
import { copyRelevantDataTypeTemplates } from '../distribution/data-types/copy-data-type-templates'
import { matchEquipment } from './matching'
import { createEquipmentUpdateEdits } from './equipment-updates'
import { createEqFunctionInsertEdits } from './eqfunction-creation'
import { createFunctionInsertEdits } from './function-creation'
import { updateBay } from './bay-update'
import { getBayElement, getDocumentAndEditor } from '../distribution'

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

    //TODO: This should only happen once the LNode is assigned later.
	const bayEdits = updateBay(scdBay, bayType)
	edits.push(bayEdits)

	const equipmentEdits = createEquipmentUpdateEdits(matches)
	edits.push(...equipmentEdits)

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
