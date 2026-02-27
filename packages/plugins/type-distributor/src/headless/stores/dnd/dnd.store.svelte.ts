import type {
	LNodeTemplate,
	EqFunctionTemplate,
	FunctionTemplate
} from '@/headless/common-types'
import {
	getBayTypeApplicationState,
	shouldApplyBayType,
	applyBayType,
	buildEditsForIed,
	generateCommitTitle,
	commitEdits
} from './drop-handler'
import { assignedLNodesStore } from '@/headless/stores'
import { buildEditsForBayLNode } from '@/headless/scl'

type DraggedItem = {
	type: 'equipmentFunction' | 'functionTemplate' | 'lNode'
	lNodes: LNodeTemplate[]
	sourceFunction: EqFunctionTemplate | FunctionTemplate
	equipmentUuid?: string
	bayTypeInstanceUuid?: string
}

function validateDraggedItem(
	draggedItem: DraggedItem | null
): draggedItem is DraggedItem {
	if (!draggedItem) {
		console.warn('[DnD] No dragged item to drop')
		return false
	}

	if (draggedItem.lNodes.length === 0) {
		console.warn('[DnD] Dragged item contains no LNodes')
		return false
	}

	return true
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
		if (!validateDraggedItem(this.draggedItem)) {
			this.handleDragEnd()
			return
		}

		const { lNodes, sourceFunction: functionFromSSD } = this.draggedItem

		try {
			const applicationState = getBayTypeApplicationState()
			const didApplyBayType = shouldApplyBayType(applicationState)
			const freshMatches = didApplyBayType
				? applyBayType(applicationState)
				: null
			const equipmentMatches = freshMatches ?? bayStore.equipmentMatches

			const allEdits = [
				...buildEditsForIed({
					sourceFunction: functionFromSSD,
					lNodes,
					targetAccessPoint,
					equipmentMatches,
					equipmentUuid: this.draggedItem.equipmentUuid
				})
			]

			const shouldUpdateBay =
				applicationState.hasAssignedBayType || didApplyBayType

			if (shouldUpdateBay) {
				allEdits.push(
					...buildEditsForBayLNode({
						lNodes,
						iedName: targetSIedName,
						sourceFunction: functionFromSSD,
						equipmentUuid: this.draggedItem.equipmentUuid,
						equipmentMatches
					})
				)
			}

			if (allEdits.length > 0) {
				const title = generateCommitTitle({
					lNodes,
					functionName: functionFromSSD.name,
					targetSIedName,
					didApplyBayType
				})

				commitEdits({ edits: allEdits, title, squash: didApplyBayType })
				const parentUuid =
					this.draggedItem.bayTypeInstanceUuid || functionFromSSD.uuid
				assignedLNodesStore.markAsAssigned(parentUuid, lNodes)
			}
		} catch (error) {
			console.error('[DnD] Error creating LNodes:', error)
		}

		this.handleDragEnd()
	}

	get currentDraggedItem() {
		return this.draggedItem
	}

	isDraggingItem(
		type: DraggedItem['type'],
		sourceFunctionUuid: string,
		bayTypeInstanceUuid?: string
	): boolean {
		if (!this.isDragging || !this.draggedItem) return false

		return (
			this.draggedItem.type === type &&
			this.draggedItem.sourceFunction.uuid === sourceFunctionUuid &&
			this.draggedItem.bayTypeInstanceUuid === bayTypeInstanceUuid
		)
	}
}

export const dndStore = new UseDndStore()
