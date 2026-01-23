import type { EqFunctionTemplate, FunctionTemplate } from '../types'

type DraggedItem = {
	type: 'equipmentFunction' | 'functionTemplate'
	data: EqFunctionTemplate | FunctionTemplate
	equipmentName?: string // Only for equipment functions
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

		console.log('[DnD] Dropping item:', {
			draggedItem: this.draggedItem,
			targetAccessPoint: targetAccessPoint.getAttribute('name'),
			targetSIed: targetSIedName
		})

		// TODO: Implement the actual drop logic
		// This will involve creating LNode references in the target AccessPoint
		// For now, just log the action

		this.handleDragEnd()
	}

	get currentDraggedItem() {
		return this.draggedItem
	}
}

export const dndStore = new UseDndStore()