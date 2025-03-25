import { typeElementsStore } from '@/headless/stores'
// CONSTANTS
import { REF_FAMILY, TYPE_FAMILY } from '@/headless/constants'
// TYPES
import type { AvailableTypeFamily, AvailableRefFamily } from '@/headless/stores'

//====== STATES ======//

class UseDnDStore {
	isDragging = $state(false)
	currentSourceTypeIdOrUuid = $state<string | undefined>(undefined)
	currentSourceTypeFamily = $state<AvailableTypeFamily | undefined>(undefined)
	currentSourceRefFamily = $state<AvailableRefFamily | undefined>(undefined)

	handleDragStart(params: {
		event: DragEvent
		sourceTypeId: string
		sourceTypeFamily: AvailableTypeFamily
		sourceRefFamily: AvailableRefFamily | undefined
	}) {
		this.isDragging = true
		this.currentSourceTypeIdOrUuid = params.sourceTypeId
		this.currentSourceTypeFamily = params.sourceTypeFamily
		this.currentSourceRefFamily = params.sourceRefFamily
	}

	handleDragEnd() {
		this.isDragging = false
		this.currentSourceTypeIdOrUuid = undefined
		this.currentSourceTypeFamily = undefined
		this.currentSourceRefFamily = undefined
	}

	handleDrop(params: {
		parentTypeWrapper: Element
		parentTypeFamily: string
	}) {
		let currentRefFamily = this.currentSourceRefFamily

		if (
			!currentRefFamily &&
			this.currentSourceTypeFamily === TYPE_FAMILY.function
		) {
			if (
				params.parentTypeFamily === TYPE_FAMILY.generalEquipment ||
				params.parentTypeFamily === TYPE_FAMILY.conductingEquipment
			)
				currentRefFamily = REF_FAMILY.eqFunction
			else currentRefFamily = REF_FAMILY.function
		}

		if (!currentRefFamily) throw new Error('No ref family')
		if (!this.currentSourceTypeIdOrUuid) throw new Error('No source family')

		typeElementsStore.createNewRef({
			family: currentRefFamily,
			sourceTypeIdOrUuid: this.currentSourceTypeIdOrUuid,
			parentTypeWrapper: params.parentTypeWrapper
		})
	}
}

export const dndStore = new UseDnDStore()
