import { elementTypesStore } from './element-types.svelte'
// TYPES
import type { ElementType, AvailableFamilies } from './types.element-types'

class UseSidebarStore {
	//====== STATES ======//

	currentElementTypeKey = $state<string | null>(null)
	currentElementTypeFamily = $state<AvailableFamilies | 'lNodeType'>(
		'lNodeType'
	)
	// currentElementType = $state<ElementType<
	// 	typeof this.currentElementTypeFamily
	// > | null>(null)

	currentElementType = $derived.by(() => {
		if (this.currentElementTypeKey === null) return null
		if (this.currentElementTypeFamily !== 'lNodeType')
			return elementTypesStore.elementTypesPerFamily[
				this.currentElementTypeFamily
			][this.currentElementTypeKey]
		return elementTypesStore.lNodeTypeElementTypes[
			this.currentElementTypeKey
		]
	})
	//====== ACTIONS ======//

	setCurrentElementType({
		key,
		family,
		element
	}: {
		key: string
		family: AvailableFamilies | 'lNodeType'
		element: ElementType<typeof family>
	}) {
		this.currentElementTypeKey = key
		this.currentElementTypeFamily = family
		// this.currentElementType = element
	}

	resetCurrentElementType() {
		this.currentElementTypeKey = null
		this.currentElementTypeFamily = 'lNodeType'
		// this.currentElementType = null
	}
}

export const sidebarStore = new UseSidebarStore()
