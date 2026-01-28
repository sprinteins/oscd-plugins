import type { EqFunctionTemplate, FunctionTemplate, LNodeTemplate } from '../types'
import { createLNodesInAccessPoint } from '../ied/create-lNode-in-access-point'

type DraggedItem = {
	type: 'equipmentFunction' | 'functionTemplate' | 'lNode'
	data: EqFunctionTemplate | FunctionTemplate | LNodeTemplate
	equipmentName?: string
	parentFunction?: EqFunctionTemplate | FunctionTemplate
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

		let lNodes: LNodeTemplate[]
		let functionFromSSD: EqFunctionTemplate | FunctionTemplate | undefined

		switch (this.draggedItem.type) {
			case 'lNode': {
				lNodes = [this.draggedItem.data as LNodeTemplate]
				functionFromSSD = this.draggedItem.parentFunction
				break
			}
			case 'equipmentFunction': {
				const data = this.draggedItem.data as EqFunctionTemplate
				lNodes = data.lnodes || []
				functionFromSSD = data
				break
			}
			case 'functionTemplate': {
				const data = this.draggedItem.data as FunctionTemplate
				lNodes = data.lnodes || []
				functionFromSSD = data
				break
			}
		}

		if (lNodes.length === 0) {
			console.warn('[DnD] Dragged item contains no LNodes')
			this.handleDragEnd()
			return
		}

		if (!functionFromSSD) {
			console.error('[DnD] No function data found for dropped item')
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