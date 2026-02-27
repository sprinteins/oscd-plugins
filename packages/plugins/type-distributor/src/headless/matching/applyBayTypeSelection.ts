import type { Insert, SetAttributes } from '@openscd/oscd-api'
import type { LNodeTemplate } from '@/headless/common-types'
import type { EquipmentMatch } from './types'
import { equipmentMatchingStore, ssdImportStore, bayStore } from '../stores'
import { resolveMatchingContext } from './resolve-matching-context'
import { buildEditsForDataTypeTemplates } from './scd-edits/data-types'
import { ensureDataTypeTemplates } from './scd-edits/data-types/ensure-data-type-templates'
import { matchEquipment } from './matching'
import {
	buildEditForBayUpdate,
	buildInsertEditsForEqFunction,
	buildEditsForEquipmentUpdates,
	buildInsertEditsForFunction
} from './scd-edits'
import { getDocumentAndEditor } from '@/headless/utils'

export function applyBayTypeSelection(bayName: string): EquipmentMatch[] {
	const { doc, editor } = getDocumentAndEditor()
	const { scdBay, bayType } = resolveMatchingContext(
		ssdImportStore.selectedBayType,
		ssdImportStore.bayTypes,
		bayStore.scdBay
	)

	const matches = matchEquipment(
		scdBay,
		bayType,
		equipmentMatchingStore.manualMatches
	)

	const edits: (Insert | SetAttributes)[] = []

	const bayEdits = buildEditForBayUpdate(scdBay, bayType)
	edits.push(bayEdits)

	const equipmentEdits = buildEditsForEquipmentUpdates(matches)
	edits.push(...equipmentEdits)

	const eqFunctionEdits = buildInsertEditsForEqFunction(doc, matches)
	edits.push(...eqFunctionEdits)

	const functionEdits = buildInsertEditsForFunction(doc, bayType, scdBay)
	edits.push(...functionEdits)

	const { element: dataTypeTemplates, edit: dtsCreationEdit } =
		ensureDataTypeTemplates(doc)

	if (dtsCreationEdit) {
		edits.push(dtsCreationEdit)
	}

	const allLNodeTemplates: LNodeTemplate[] = []

	for (const match of matches) {
		for (const eqFunctionTemplate of match.templateEquipment.eqFunctions) {
			allLNodeTemplates.push(...eqFunctionTemplate.lnodes)
		}
	}

	for (const functionType of bayType.functions) {
		const functionTemplate = ssdImportStore.getFunctionTemplate(
			functionType.templateUuid
		)
		if (functionTemplate) {
			allLNodeTemplates.push(...functionTemplate.lnodes)
		}
	}

	const dataTypeTemplateEdits = buildEditsForDataTypeTemplates(
		doc,
		dataTypeTemplates,
		allLNodeTemplates
	)
	edits.push(...dataTypeTemplateEdits)

	editor.commit(edits, {
		title: `Assign BayType "${bayType.name}" to Bay "${bayName}"`
	})

	return matches
}
