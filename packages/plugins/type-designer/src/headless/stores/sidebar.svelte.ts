import { tick } from 'svelte'
// STORES
import { typeElementsStore } from '@/headless/stores'
// TYPES
import type { TypeElement, AvailableTypeFamily } from '@/headless/stores'

class UseSidebarStore {
	//====== STATES ======//

	currentElementTypeKey = $state<string | null>(null)
	currentElementTypeFamily = $state<AvailableTypeFamily | null>(null)
	currentElementType = $state<TypeElement<AvailableTypeFamily> | null>(null)
	isCurrentElementImported = $state<boolean>(false)

	isInputValidByAttributeKey = $derived.by(() => {
		if (this.currentElementType)
			return Object.fromEntries(
				Object.keys(this.currentElementType?.attributes).map(
					(attributeKey) => {
						if (attributeKey === 'name')
							return [attributeKey, this.validateName()]
						return [attributeKey, true]
					}
				)
			)
	})

	//====== ACTIONS ======//

	validateName() {
		if (
			!this.currentElementTypeFamily ||
			!this.currentElementType?.attributes.name
		)
			return

		const currentNameToTest = this.currentElementType.attributes.name
		const elementsWithSameNameBase =
			typeElementsStore.getElementsWithSameNameBase({
				family: this.currentElementTypeFamily,
				valueToTest: currentNameToTest,
				removeOccurrencePartToTestedValue: false
			})
		const elementsWithSameNameBaseWithoutCurrentElement =
			elementsWithSameNameBase.filter(
				(element) =>
					element.attributes.uuid !==
					this.currentElementType?.attributes.uuid
			)
		if (elementsWithSameNameBaseWithoutCurrentElement.length >= 1)
			return false
		return true
	}

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

	async refreshCurrentElementType() {
		if (!this.currentElementTypeKey || !this.currentElementTypeFamily)
			return

		await tick()

		this.currentElementType =
			typeElementsStore.typeElementsPerFamily[
				this.currentElementTypeFamily
			][this.currentElementTypeKey]
	}

	resetCurrentElementType() {
		this.currentElementTypeKey = null
		this.currentElementTypeFamily = null
		this.currentElementType = null
		this.isCurrentElementImported = false
	}
}

export const sidebarStore = new UseSidebarStore()
