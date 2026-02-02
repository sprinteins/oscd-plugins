import type { Insert, SetAttributes } from '@openscd/oscd-api'
import type {
	LNodeTemplate,
	EqFunctionTemplate,
	FunctionTemplate
} from '@/headless/common-types'
import { applyBayTypeSelection } from '@/headless/matching'
import { createMultipleLNodesInAccessPoint } from '@/headless/ied/create-lNode-in-access-point'
import { updateBayLNodeIedNames } from '@/headless/ied/update-bay-lnodes'
import { pluginGlobalStore } from '@oscd-plugins/core-ui-svelte'
import { bayTypesStore } from '../bay-types.store.svelte'
import { bayStore } from '../bay.store.svelte'
import { equipmentMatchingStore } from '../equipment-matching.store.svelte'

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
		!!bayTypesStore.selectedBayType &&
		!!validation?.isValid &&
		!requiresManualMatching

	const hasPendingManualSelection =
		!!bayStore.pendingBayTypeApply && requiresManualMatching

	return {
		hasAssignedBayType: !!bayStore.assigendBayType,
		hasSelectedBay: !!bayStore.selectedBay,
		requiresManualMatching,
		hasValidAutoSelection,
		hasPendingManualSelection
	}
}

export function applyBayTypeIfNeeded(state: BayTypeApplicationState): boolean {
	if (!shouldApplyBayType(state)) {
		return false
	}

	if (state.hasPendingManualSelection) {
		bayTypesStore.selectedBayType = bayStore.pendingBayTypeApply
	}

	if (!bayStore.selectedBay) {
		throw new Error('[DnD] No bay type selected to apply to bay')
	}

	applyBayTypeSelection(bayStore.selectedBay)
	bayStore.assigendBayType = bayTypesStore.selectedBayType
	bayStore.pendingBayTypeApply = null
	equipmentMatchingStore.clearValidationResult()

	return true
}

export function createIedEdits(
	sourceFunction: EqFunctionTemplate | FunctionTemplate,
	lNodes: LNodeTemplate[],
	targetAccessPoint: Element,
	equipmentUuid?: string
): (Insert | SetAttributes)[] {
	return createMultipleLNodesInAccessPoint({
		sourceFunction,
		lNodes,
		accessPoint: targetAccessPoint,
		equipmentUuid
	})
}

export function createBayEdits(
	lNodes: LNodeTemplate[],
	targetSIedName: string,
	sourceFunction: EqFunctionTemplate | FunctionTemplate,
	equipmentUuid?: string
): (Insert | SetAttributes)[] {
	if (!bayStore.scdBay) {
		return []
	}

	return updateBayLNodeIedNames({
		scdBay: bayStore.scdBay,
		lNodes,
		iedName: targetSIedName,
		sourceFunction,
		equipmentUuid
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
		const bayTypeUuid = bayTypesStore.selectedBayType
		const bayTypeDetails = bayTypeUuid
			? bayTypesStore.getBayTypeWithTemplates(bayTypeUuid)
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
	const editor = pluginGlobalStore.editor
	if (!editor) {
		throw new Error('No editor found')
	}

	editor.commit(edits, squash ? { title, squash: true } : { title })
}
