// TYPES
import type { TypeElement, AvailableTypeFamily } from '@/headless/stores'

class UseSidebarStore {
	//====== STATES ======//

	currentElementTypeKey = $state<string | null>(null)
	currentElementTypeFamily = $state<AvailableTypeFamily | null>(null)
	currentElementType = $state<TypeElement<AvailableTypeFamily> | null>(null)

	//====== ACTIONS ======//

	setCurrentElementType({
		key,
		family,
		element
	}: {
		key: string
		family: AvailableTypeFamily
		element: TypeElement<typeof family>
	}) {
		this.currentElementTypeFamily = family
		this.currentElementTypeKey = key
		this.currentElementType = element
	}

	resetCurrentElementType() {
		this.currentElementTypeKey = null
		this.currentElementTypeFamily = null
		this.currentElementType = null
	}
}

export const sidebarStore = new UseSidebarStore()
