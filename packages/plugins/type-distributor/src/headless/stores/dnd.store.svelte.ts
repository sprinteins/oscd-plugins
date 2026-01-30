import type {
	EqFunctionTemplate,
	FunctionTemplate,
	LNodeTemplate
} from '../common-types'
import type { Insert, SetAttributes } from '@openscd/oscd-api'
import { pluginGlobalStore } from '@oscd-plugins/core-ui-svelte'
import { createLNodesInAccessPoint } from '../ied/create-lNode-in-access-point'
import { updateBayLNodeIedNames } from '../ied/update-bay-lnodes'
import { applyBayTypeSelection } from '../matching'
import { bayStore } from './bay.store.svelte'
import { bayTypesStore } from './bay-types.store.svelte'
import { equipmentMatchingStore } from './equipment-matching.store.svelte'

type DraggedItem = {
	type: 'equipmentFunction' | 'functionTemplate' | 'lNode'
	lNodes: LNodeTemplate[]
	sourceFunction: EqFunctionTemplate | FunctionTemplate
	equipmentUuid?: string
}

class UseDndStore {
	isDragging = $state(false)
	draggedItem = $state<DraggedItem | null>(null)

	handleDragStart(item: DraggedItem) {
		this.isDragging = true
		this.draggedItem = item
	}

	handleDragEnd() {
		this.isDragging = false
		this.draggedItem = null
	}

	handleDrop(targetAccessPoint: Element, targetSIedName: string) {
		if (!this.draggedItem) {
			console.warn('[DnD] No dragged item to drop')
			return
		}

		const { lNodes, sourceFunction: functionFromSSD } = this.draggedItem

		if (lNodes.length === 0) {
			console.warn('[DnD] Dragged item contains no LNodes')
			this.handleDragEnd()
			return
		}

		try {
			const hasAssignedBayType = !!bayStore.assigendBayType
			const hasSelectedBay = !!bayStore.selectedBay
			const validation = equipmentMatchingStore.validationResult

			let didApplyBayType = false

			if (!hasAssignedBayType && hasSelectedBay) {
				const requiresManualMatching =
					validation?.requiresManualMatching ?? false

				const hasValidAutoSelection =
					!!bayTypesStore.selectedBayType &&
					!!validation?.isValid &&
					!requiresManualMatching

				const hasPendingManualSelection =
					!!bayStore.pendingBayTypeApply && requiresManualMatching

				if (hasPendingManualSelection) {
					bayTypesStore.selectedBayType = bayStore.pendingBayTypeApply
				}

				if (hasValidAutoSelection || hasPendingManualSelection) {
					applyBayTypeSelection(bayStore.selectedBay)
					bayStore.assigendBayType = bayTypesStore.selectedBayType
					bayStore.pendingBayTypeApply = null
					equipmentMatchingStore.clearValidationResult()
					didApplyBayType = true
				}
			}

			const allEdits: (Insert | SetAttributes)[] = []

			const iedEdits = createLNodesInAccessPoint({
				sourceFunction: functionFromSSD,
				lNodes,
				iedName: targetSIedName,
				accessPoint: targetAccessPoint
			})
			allEdits.push(...iedEdits)

			if (bayStore.scdBay && (hasAssignedBayType || didApplyBayType)) {
				const bayEdits = updateBayLNodeIedNames({
					scdBay: bayStore.scdBay,
					lNodes,
					iedName: targetSIedName,
					sourceFunction: functionFromSSD,
					equipmentUuid: this.draggedItem.equipmentUuid
				})
				allEdits.push(...bayEdits)
			}

			if (allEdits.length > 0) {
				const editor = pluginGlobalStore.editor
				if (!editor) {
					throw new Error('No editor found')
				}

				const functionName = functionFromSSD.name
				const lnodeInfo =
					lNodes.length === 1
						? `${lNodes[0].lnClass}`
						: `${lNodes.length} LNodes`

				const title = didApplyBayType
					? `Apply BayType and assign ${lnodeInfo} from ${functionName} to IED ${targetSIedName}`
					: `Assign ${lnodeInfo} from ${functionName} to IED ${targetSIedName}`

				editor.commit(
					allEdits,
					didApplyBayType ? { squash: true } : { title }
				)
			}
		} catch (error) {
			console.error('[DnD] Error creating LNodes:', error)
		}
		this.handleDragEnd()
	}

	get currentDraggedItem() {
		return this.draggedItem
	}
}
export const dndStore = new UseDndStore()
