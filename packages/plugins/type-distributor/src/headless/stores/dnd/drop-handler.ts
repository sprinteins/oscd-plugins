import type { Insert, SetAttributes } from '@openscd/oscd-api'
import type {
	LNodeTemplate,
	EqFunctionTemplate,
	FunctionTemplate
} from '@/headless/common-types'
import type { EquipmentMatch } from '@/headless/matching/types'
import { applyBayTypeSelection } from '@/headless/matching'
import { ssdImportStore } from '../ssd-import.store.svelte'
import { getBayTypeWithTemplates } from '../bay-types.utils'
import { bayStore } from '../bay.store.svelte'
import { equipmentMatchingStore } from '../equipment-matching.store.svelte'
import { getDocumentAndEditor } from '@/headless/utils/get-document-and-Editor'
import { createMultipleLNodesInAccessPoint } from '@/headless/ied'

type BayTypeApplicationState = {
	hasAssignedBayType: boolean
	hasSelectedBay: boolean
	requiresManualMatching: boolean
	hasValidAutoSelection: boolean
	hasPendingManualSelection: boolean
}

export function shouldApplyBayType(state: BayTypeApplicationState): boolean {
	if (state.hasAssignedBayType || !state.hasSelectedBay) {
		return false
	}

	return state.hasValidAutoSelection || state.hasPendingManualSelection
}

export function getBayTypeApplicationState(): BayTypeApplicationState {
	const validation = equipmentMatchingStore.validationResult
	const requiresManualMatching = validation?.requiresManualMatching ?? false

	const hasValidAutoSelection =
		!!ssdImportStore.selectedBayType &&
		!!validation?.isValid &&
		!requiresManualMatching

	const hasPendingManualSelection =
		!!bayStore.pendingBayTypeApply && requiresManualMatching

	return {
		hasAssignedBayType: !!bayStore.assignedBayTypeUuid,
		hasSelectedBay: !!bayStore.selectedBay,
		requiresManualMatching,
		hasValidAutoSelection,
		hasPendingManualSelection
	}
}

export function applyBayType(
	state: BayTypeApplicationState
): EquipmentMatch[] {
	if (state.hasPendingManualSelection) {
		ssdImportStore.selectedBayType = bayStore.pendingBayTypeApply
	}

	if (!bayStore.selectedBay) {
		throw new Error('[DnD] No bay type selected to apply to bay')
	}

	const matches = applyBayTypeSelection(bayStore.selectedBay)
	bayStore.pendingBayTypeApply = null
	equipmentMatchingStore.clearValidationResult()

	return matches
}

export function buildEditsForIed(
	sourceFunction: EqFunctionTemplate | FunctionTemplate,
	lNodes: LNodeTemplate[],
	targetAccessPoint: Element,
	equipmentMatches: EquipmentMatch[],
	equipmentUuid?: string
): (Insert | SetAttributes)[] {
	return createMultipleLNodesInAccessPoint({
		sourceFunction,
		lNodes,
		accessPoint: targetAccessPoint,
		equipmentUuid,
		equipmentMatches
	})
}

export function generateCommitTitle(
	lNodes: LNodeTemplate[],
	functionName: string,
	targetSIedName: string,
	didApplyBayType: boolean
): string {
	const lnodeInfo =
		lNodes.length === 1 ? `${lNodes[0].lnClass}` : `${lNodes.length} LNodes`

	if (didApplyBayType) {
		const bayName = bayStore.selectedBay ?? 'Unknown'
		const bayTypeUuid = ssdImportStore.selectedBayType
		const bayTypeDetails = bayTypeUuid
			? getBayTypeWithTemplates(bayTypeUuid)
			: null
		const bayTypeName = bayTypeDetails?.name ?? 'Unknown'

		return `Assign BayType "${bayTypeName}" to Bay "${bayName}" + Assign ${lnodeInfo} from ${functionName} to IED ${targetSIedName}`
	}

	return `Assign ${lnodeInfo} from ${functionName} to IED ${targetSIedName}`
}

export function commitEdits(
	edits: (Insert | SetAttributes)[],
	title: string,
	squash: boolean
): void {
	const { editor } = getDocumentAndEditor()

	editor.commit(edits, squash ? { title, squash: true } : { title })
}
