// TYPES
import type { TypeElement, AvailableTypeFamily } from '@/headless/stores'

class UseSidebarStore {
	//====== STATES ======//

	currentElementTypeKey = $state<string | null>(null)
	currentElementTypeFamily = $state<AvailableTypeFamily | null>(null)
	currentElementType = $state<TypeElement<AvailableTypeFamily> | null>(null)
	isCurrentElementImported = $state<boolean>(false)
	//====== ACTIONS ======//

	setCurrentElementType({
		key,
		family,
		element,
		isImported
	}: {
		key: string
		family: AvailableTypeFamily
		element: TypeElement<AvailableTypeFamily>
		isImported: boolean
	}) {
		this.currentElementTypeFamily = family
		this.currentElementTypeKey = key
		this.currentElementType = element
		this.isCurrentElementImported = isImported
	}

	resetCurrentElementType() {
		this.currentElementTypeKey = null
		this.currentElementTypeFamily = null
		this.currentElementType = null
		this.isCurrentElementImported = false
	}
}

export const sidebarStore = new UseSidebarStore()
