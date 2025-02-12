import { typeElementsStore } from '@/headless/stores'
// CONSTANTS
import { REF_FAMILY_MAP, TYPE_FAMILY_MAP } from '@/headless/constants'
// TYPES
import type { AvailableTypeFamily, AvailableRefFamily } from '@/headless/stores'

//====== STATES ======//

class UseDnDStore {
	isDragging = $state(false)
	currentSourceTypeIdOrUuid = $state<string | null>(null)
	currentSourceFamilyKey = $state<AvailableTypeFamily | null>(null)
	currentSourceRefFamily = $state<
		AvailableRefFamily | null | 'genericFunction'
	>(null)

	addOrRemoveClassesToTarget(
		event: DragEvent,
		classes: string[],
		operation: 'add' | 'remove'
	) {
		const target = event.target as HTMLElement
		target.classList[operation](classes.join(','))
	}

	handleDragStart(args: {
		event: DragEvent
		sourceTypeId: string
		sourceFamilyKey: AvailableTypeFamily
		sourceRefFamily: AvailableRefFamily | 'genericFunction'
	}) {
		this.isDragging = true
		this.currentSourceTypeIdOrUuid = args.sourceTypeId
		this.currentSourceFamilyKey = args.sourceFamilyKey
		this.currentSourceRefFamily = args.sourceRefFamily

		this.addOrRemoveClassesToTarget(
			args.event,
			['opacity-60', '!cursor-grabbing'],
			'add'
		)
	}

	handleDragEnd(event: DragEvent) {
		this.isDragging = false
		this.currentSourceTypeIdOrUuid = null
		this.currentSourceFamilyKey = null
		this.currentSourceRefFamily = null
		this.addOrRemoveClassesToTarget(event, ['opacity-60'], 'remove')
	}

	handleDragOver(event: DragEvent) {
		event.preventDefault()
		this.addOrRemoveClassesToTarget(
			event,
			['bg-gray-500', 'border-solid'],
			'add'
		)
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

	handleDrop(
		event: DragEvent,
		parentTypeWrapper: Element,
		typeElementFamily: string
	) {
		let currentFamily = this.currentSourceRefFamily

		if (!currentFamily) throw new Error('No source ref family')
		if (!this.currentSourceTypeIdOrUuid) throw new Error('No source family')

		if (currentFamily === 'genericFunction') {
			if (
				typeElementFamily === TYPE_FAMILY_MAP.generalEquipmentType ||
				typeElementFamily === TYPE_FAMILY_MAP.conductingEquipmentType
			)
				currentFamily = REF_FAMILY_MAP.eqFunction
			else currentFamily = REF_FAMILY_MAP.function
		}

		typeElementsStore.createNewRef({
			family: currentFamily,
			sourceTypeIdOrUuid: this.currentSourceTypeIdOrUuid,
			parentTypeWrapper
		})
	}
}

export const dndStore = new UseDnDStore()
