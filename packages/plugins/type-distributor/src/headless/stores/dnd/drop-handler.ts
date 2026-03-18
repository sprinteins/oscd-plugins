import type { Insert, SetAttributes } from '@openscd/oscd-api'
import { applyBayType as applyBayTypeAction } from '@/headless/actions'
import type {
	EqFunctionTemplate,
	FunctionTemplate,
	LNodeTemplate
} from '@/headless/common-types'
import type { EquipmentMatch } from '@/headless/domain/matching'
import { createMultipleLNodesInAccessPoint } from '@/headless/scl'
import { getDocumentAndEditor } from '@/headless/utils/get-document-and-Editor'
import { bayStore } from '../bay.store.svelte'
import { getBayTypeWithTemplates } from '../bay-types.utils'
import { equipmentMatchingStore } from '../equipment-matching.store.svelte'
import { ssdImportStore } from '../ssd-import.store.svelte'

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

export function applyBayType(state: BayTypeApplicationState): EquipmentMatch[] {
	if (state.hasPendingManualSelection) {
		ssdImportStore.selectedBayType = bayStore.pendingBayTypeApply
	}

	if (!bayStore.selectedBay) {
		throw new Error('[DnD] No bay type selected to apply to bay')
	}

	const matches = applyBayTypeAction(bayStore.selectedBay)
	bayStore.pendingBayTypeApply = null
	equipmentMatchingStore.reset()

	return matches
}

type BuildEditsForIedParams = {
	sourceFunction: EqFunctionTemplate | FunctionTemplate
	lNodes: LNodeTemplate[]
	targetAccessPoint: Element
	equipmentMatches: EquipmentMatch[]
	equipmentUuid?: string
}

export function buildEditsForIed({
	sourceFunction,
	lNodes,
	targetAccessPoint,
	equipmentMatches,
	equipmentUuid
}: BuildEditsForIedParams): (Insert | SetAttributes)[] {
	return createMultipleLNodesInAccessPoint({
		sourceFunction,
		lNodes,
		accessPoint: targetAccessPoint,
		equipmentUuid,
		equipmentMatches
	})
}

type GenerateCommitTitleParams = {
	lNodes: LNodeTemplate[]
	functionName: string
	targetSIedName: string
	didApplyBayType: boolean
}

export function generateCommitTitle({
	lNodes,
	functionName,
	targetSIedName,
	didApplyBayType
}: GenerateCommitTitleParams): string {
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

type CommitEditsParams = {
	edits: (Insert | SetAttributes)[]
	title: string
	squash: boolean
}

export function commitEdits({ edits, title, squash }: CommitEditsParams): void {
	const { editor } = getDocumentAndEditor()

	editor.commit(edits, squash ? { title, squash: true } : { title })
}
