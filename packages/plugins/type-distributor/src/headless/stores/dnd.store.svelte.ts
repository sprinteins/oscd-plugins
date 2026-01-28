import type { EqFunctionTemplate, FunctionTemplate, LNodeTemplate } from '../types'
import { createLNodesInAccessPoint } from '../ied/create-lNode-in-access-point'

type DraggedItem = {
	type: 'equipmentFunction' | 'functionTemplate' | 'lNode'
	lNodes: LNodeTemplate[]
	function: EqFunctionTemplate | FunctionTemplate
	equipmentName?: string
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

		const { lNodes, function: functionFromSSD } = this.draggedItem

		if (lNodes.length === 0) {
			console.warn('[DnD] Dragged item contains no LNodes')
			this.handleDragEnd()
			return
		}

		try {
			createLNodesInAccessPoint(
				functionFromSSD,
				lNodes,
				targetSIedName,
				targetAccessPoint
			)
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