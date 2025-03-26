import { typeElementsStore } from '@/headless/stores'
// CONSTANTS
import { REF_FAMILY, TYPE_FAMILY } from '@/headless/constants'
// TYPES
import type { AvailableTypeFamily, AvailableRefFamily } from '@/headless/stores'

//====== STATES ======//

class UseDnDStore {
	isDragging = $state(false)
	currentSourceTypeIdOrUuid = $state<string>()
	currentSourceTypeFamily = $state<AvailableTypeFamily>()
	currentSourceRefFamily = $state<AvailableRefFamily>()
	
	currentDropTargetId = $state<string>()
	isDropZoneVisible = $state(false)
	
	private dragLeaveTimeout: number | undefined

	handleDragStart({ event, sourceTypeId, sourceTypeFamily, sourceRefFamily }: {
		event: DragEvent
		sourceTypeId: string
		sourceTypeFamily: AvailableTypeFamily
		sourceRefFamily?: AvailableRefFamily
	}) {
		this.isDragging = true
		this.currentSourceTypeIdOrUuid = sourceTypeId
		this.currentSourceTypeFamily = sourceTypeFamily
		this.currentSourceRefFamily = sourceRefFamily
	}

	handleDragEnd() {
		this.isDragging = false
		this.currentSourceTypeIdOrUuid = undefined
		this.currentSourceTypeFamily = undefined
		this.currentSourceRefFamily = undefined
	}

	handleDragOver({ targetId, isAllowedToDrop }: { 
		targetId: string, 
		isAllowedToDrop: boolean 
	}) {
		if (!this.isDragging || !isAllowedToDrop) return false
		window.dispatchEvent(new CustomEvent('hideAllDropZones'))
		return true
	}

	handleDragLeave({ targetId, relatedTarget }: { 
		targetId: string, 
		relatedTarget: Element | null 
	}) {
		if (relatedTarget?.closest(`[data-dnd-id="${targetId}"]`)) {
			return
		}
		
		this.dragLeaveTimeout = window.setTimeout(() => {
			if (this.currentDropTargetId === targetId) {
				this.isDropZoneVisible = false
				this.currentDropTargetId = undefined
			}
		}, 50)
	}

	handleDrop({ parentTypeWrapper, parentTypeFamily }: {
		parentTypeWrapper: Element
		parentTypeFamily: AvailableTypeFamily
	}) {
		let currentRefFamily = this.currentSourceRefFamily

		if (
			!currentRefFamily &&
			this.currentSourceTypeFamily === TYPE_FAMILY.function
		) {
			if (
				parentTypeFamily === TYPE_FAMILY.generalEquipment ||
				parentTypeFamily === TYPE_FAMILY.conductingEquipment
			)
				currentRefFamily = REF_FAMILY.eqFunction
			else currentRefFamily = REF_FAMILY.function
		}

		if (!currentRefFamily) throw new Error('No ref family')
		if (!this.currentSourceTypeIdOrUuid) throw new Error('No source family')

		typeElementsStore.createNewRef({
			family: currentRefFamily,
			sourceTypeIdOrUuid: this.currentSourceTypeIdOrUuid,
			parentTypeWrapper: parentTypeWrapper
		})

		this.resetDragState()
	}

	private resetDragState() {
		this.isDragging = false
		this.currentSourceTypeIdOrUuid = undefined
		this.currentSourceTypeFamily = undefined
		this.currentSourceRefFamily = undefined
		this.currentDropTargetId = undefined
		this.isDropZoneVisible = false
		
		if (this.dragLeaveTimeout) {
			clearTimeout(this.dragLeaveTimeout)
			this.dragLeaveTimeout = undefined
		}
	}
}

export const dndStore = new UseDnDStore()
