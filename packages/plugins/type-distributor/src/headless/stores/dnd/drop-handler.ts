import type { Insert, SetAttributes } from '@openscd/oscd-api'
import { applyBayType as applyBayTypeAction } from '@/headless/actions'
import type { LNodeTemplate } from '@/headless/common-types'
import type { EquipmentMatch, ValidationResult } from '@/headless/domain/matching'
import { getDocumentAndEditor } from '@/headless/utils/get-document-and-Editor'
import { bayStore } from '../bay.store.svelte'
import { getBayTypeWithTemplates } from '../bay-types.utils'
import { ssdImportStore } from '../ssd-import.store.svelte'

type ShouldApplyBayTypeParams = {
	assignedBayTypeUuid: string | null
	selectedBayType: string | null
	validationResult: ValidationResult | null
	manualMatchingConfirmed: boolean
}

export function shouldApplyBayType({
	assignedBayTypeUuid,
	selectedBayType,
	validationResult,
	manualMatchingConfirmed
}: ShouldApplyBayTypeParams): boolean {
	if (assignedBayTypeUuid) return false
	if (!selectedBayType) return false
	if (!validationResult) return false

	if (validationResult.isValid && !validationResult.requiresManualMatching) {
		return true
	}

	if (validationResult.requiresManualMatching && manualMatchingConfirmed) {
		return true
	}

	return false
}

export function applyBayType(): EquipmentMatch[] {
	if (!bayStore.selectedBay) {
		throw new Error('[DnD] No bay selected to apply bay type to')
	}

	const matches = applyBayTypeAction(bayStore.selectedBay)

	return matches
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
