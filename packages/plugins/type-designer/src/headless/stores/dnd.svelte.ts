// CONSTANTS
import { REF_FAMILY, TYPE_FAMILY } from '@/headless/constants'
// TYPES
import type { AvailableRefFamily, AvailableTypeFamily } from '@/headless/stores'
import { typeElementsStore } from '@/headless/stores'

//====== STATES ======//

class UseDnDStore {
	isDragging = $state(false)
	currentSourceTypeIdOrUuid = $state<string>()
	currentSourceTypeFamily = $state<AvailableTypeFamily>()
	currentSourceRefFamily = $state<AvailableRefFamily>()

	handleDragStart({
		sourceTypeId,
		sourceTypeFamily,
		sourceRefFamily
	}: {
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

	handleDrop({
		parentTypeWrapper,
		parentTypeFamily
	}: {
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
	}
}

export const dndStore = new UseDnDStore()
