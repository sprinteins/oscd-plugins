import type { LNodeTemplate, EqFunctionTemplate, FunctionTemplate } from '@/headless/common-types'
import {
	getBayTypeApplicationState,
	applyBayTypeIfNeeded,
	createIedEdits,
	createBayEdits,
	generateCommitTitle,
	commitEdits
} from './drop-handler'

type DraggedItem = {
	type: 'equipmentFunction' | 'functionTemplate' | 'lNode'
	lNodes: LNodeTemplate[]
	sourceFunction: EqFunctionTemplate | FunctionTemplate
	equipmentUuid?: string
}

function validateDraggedItem(draggedItem: DraggedItem | null): draggedItem is DraggedItem {
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
			const didApplyBayType = applyBayTypeIfNeeded(applicationState)

			const allEdits = [
				...createIedEdits(
					functionFromSSD,
					lNodes,
					targetAccessPoint,
					this.draggedItem.equipmentUuid
				)
			]

			const shouldUpdateBay =
				applicationState.hasAssignedBayType || didApplyBayType

			if (shouldUpdateBay) {
				allEdits.push(
					...createBayEdits(
						lNodes,
						targetSIedName,
						functionFromSSD,
						this.draggedItem.equipmentUuid
					)
				)
			}

			if (allEdits.length > 0) {
				const title = generateCommitTitle(
					lNodes,
					functionFromSSD.name,
					targetSIedName,
					didApplyBayType
				)

				commitEdits(allEdits, title, didApplyBayType)
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
