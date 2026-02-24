import type { Insert, SetAttributes } from '@openscd/oscd-api'
import type { LNodeTemplate } from '@/headless/common-types'
import {
	ssdImportStore,
	bayTypesStore,
	equipmentMatchingStore,
	bayStore
} from '../stores'
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
}
