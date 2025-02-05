import { elementTypesStore } from './element-types.svelte'

// TYPES
import type {
	AvailableFamilies,
	Columns,
	ElementTypes
} from './types.element-types'

//====== STATES ======//

class UseDnDStore {
	isDragging = $state(false)
	currentDraggedElementTypeKey = $state<string | null>(null)
	currentSourceFamilyKey = $state<AvailableFamilies | 'lNodeType' | null>(
		null
	)

	addOrRemoveClassesToTarget(
		event: DragEvent,
		classes: string[],
		operation: 'add' | 'remove'
	) {
		const target = event.target as HTMLElement
		target.classList[operation](classes.join(','))
	}

	handleDragStart(
		event: DragEvent,
		elementTypeId: string,
		sourceFamilyKey: AvailableFamilies | 'lNodeType'
	) {
		this.isDragging = true
		this.currentDraggedElementTypeKey = elementTypeId
		this.currentSourceFamilyKey = sourceFamilyKey

		this.addOrRemoveClassesToTarget(
			event,
			['opacity-60', '!cursor-grabbing'],
			'add'
		)
	}

	handleDragEnd(event: DragEvent) {
		this.isDragging = false
		this.currentDraggedElementTypeKey = null
		this.currentSourceFamilyKey = null
		this.addOrRemoveClassesToTarget(event, ['opacity-60'], 'remove')
	}

	handleDragOver(event: DragEvent) {
		event.preventDefault()
	}

	handleDragEnter(event: DragEvent) {
		event.preventDefault()
		const target = event.target as HTMLElement
		target.classList.add('border-primary', 'border-solid')
	}

	handleDragLeave(event: DragEvent) {
		event.preventDefault()
		const target = event.target as HTMLElement
		target.classList.remove('border-primary', 'border-solid')
	}

	handleDrop({
		event,
		currentTargetColumnKey,
		currentElementTypeFamily,
		currentElementTypeKey
	}: {
		event: DragEvent
		currentTargetColumnKey: keyof Columns
		currentElementTypeFamily: AvailableFamilies | 'lNodeType'
		currentElementTypeKey: string
	}) {
		if (this.currentDraggedElementTypeKey) {
			const elementTypes = elementTypesStore.columns[
				currentTargetColumnKey
			].groupedElementTypes as Record<
				typeof currentElementTypeFamily,
				ElementTypes<typeof currentElementTypeFamily>
			>

			elementTypes[currentElementTypeFamily][
				currentElementTypeKey
			].typeRefs.push(this.currentDraggedElementTypeKey)
		}
	}
}

export const dndStore = new UseDnDStore()
