import type { EqFunctionTemplate, FunctionTemplate, LNodeTemplate } from '../types'
import { createLNodesInAccessPoint } from '../ied/create-lNode-in-access-point'

type DraggedItem = {
	type: 'equipmentFunction' | 'functionTemplate' | 'lNode'
	data: EqFunctionTemplate | FunctionTemplate | LNodeTemplate
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

		let lNodes: LNodeTemplate[]
		let lDeviceInst = this.draggedItem.equipmentName ?? 'LD1'

		switch (this.draggedItem.type) {
			case 'lNode': {
				lNodes = [this.draggedItem.data as LNodeTemplate]
				break
			}
			case 'equipmentFunction': {
				const data = this.draggedItem.data as EqFunctionTemplate
				lNodes = data.lnodes || []
				lDeviceInst = this.draggedItem.equipmentName ?? 'LD1'
				break
			}
			case 'functionTemplate': {
				const data = this.draggedItem.data as FunctionTemplate
				lNodes = data.lnodes || []
				lDeviceInst = data.name ?? 'LD1'
				break
			}
		}

		if (lNodes.length === 0) {
			console.warn('[DnD] Dragged item contains no LNodes')
			this.handleDragEnd()
			return
		}

		try {
			createLNodesInAccessPoint({
				accessPoint: targetAccessPoint,
				lNodes,
				iedName: targetSIedName,
				lDeviceInst
			})
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