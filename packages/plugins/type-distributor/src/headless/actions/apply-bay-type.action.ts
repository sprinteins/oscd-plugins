import type { Insert, SetAttributes } from '@openscd/oscd-api'
import type { LNodeTemplate } from '@/headless/common-types'
import type { EquipmentMatch } from '@/headless/domain/matching'
import {
	matchEquipmentForInitialApply,
	resolveMatchingContext
} from '@/headless/domain/matching'
import {
	buildEditForBayUpdate,
	buildEditsForEquipmentUpdates
} from '@/headless/scl/edits/bay-type-edits'
import {
	buildEditsForDataTypeTemplates,
	ensureDataTypeTemplates
} from '@/headless/scl/edits/data-type-edits'
import {
	buildInsertEditsForEqFunction,
	buildInsertEditsForFunction
} from '@/headless/scl/edits/function-edits'
import {
	bayStore,
	equipmentMatchingStore,
	ssdImportStore
} from '@/headless/stores'
import { getDocumentAndEditor } from '@/headless/utils'

export function applyBayType(bayName: string): EquipmentMatch[] {
	const { doc, editor } = getDocumentAndEditor()
	const { scdBay, bayType } = resolveMatchingContext({
		selectedBayTypeUuid: ssdImportStore.selectedBayType,
		bayTypes: ssdImportStore.bayTypes,
		scdBay: bayStore.scdBay
	})

	const matches = matchEquipmentForInitialApply({
		scdBay,
		bayType,
		conductingEquipmentTemplates:
			ssdImportStore.conductingEquipmentTemplates,
		manualMatches: equipmentMatchingStore.manualMatches
	})

	const edits: (Insert | SetAttributes)[] = []

	edits.push(buildEditForBayUpdate(scdBay, bayType))
	edits.push(...buildEditsForEquipmentUpdates(matches))
	edits.push(...buildInsertEditsForEqFunction(doc, matches))
	edits.push(
		...buildInsertEditsForFunction({
			doc,
			bayType,
			scdBay,
			functionTemplates: ssdImportStore.functionTemplates
		})
	)

	const { element: dataTypeTemplates, edit: dtsCreationEdit } =
		ensureDataTypeTemplates(doc)

	if (dtsCreationEdit) {
		edits.push(dtsCreationEdit)
	}

	const ssdDoc = ssdImportStore.loadedSSDDocument
	if (!ssdDoc) throw new Error('No SSD document loaded')

	const allLNodeTemplates: LNodeTemplate[] = []

	for (const match of matches) {
		for (const eqFunctionTemplate of match.templateEquipment.eqFunctions) {
			allLNodeTemplates.push(...eqFunctionTemplate.lnodes)
		}
	}

	for (const functionType of bayType.functions) {
		const functionTemplate = ssdImportStore.functionTemplates.find(
			(t) => t.uuid === functionType.templateUuid
		)
		if (functionTemplate) {
			allLNodeTemplates.push(...functionTemplate.lnodes)
		}
	}

	edits.push(
		...buildEditsForDataTypeTemplates(
			doc,
			dataTypeTemplates,
			allLNodeTemplates,
			ssdDoc
		)
	)

	editor.commit(edits, {
		title: `Assign BayType "${bayType.name}" to Bay "${bayName}"`
	})

	return matches
}
