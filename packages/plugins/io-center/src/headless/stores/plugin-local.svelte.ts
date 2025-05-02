// CORE
import {
	createAndDispatchEditEvent,
	getAttributes,
	getAttributesNS,
	typeGuard
} from '@oscd-plugins/core-api/plugin/v1'
import { pluginGlobalStore } from '@oscd-plugins/core-ui-svelte'
// CONSTANTS
import { ELEMENT_WITH_REQUIRED_UUID_ATTRIBUTES } from '@/headless/constants'
// TYPES
import type { IEC61850 } from '@oscd-plugins/core-standard'

class UsePluginLocalStore {
	//====== CONSTANTS ======//

	// CHANGE THESE VALUES TO MATCH YOUR PLUGIN
	currentEdition: IEC61850.AvailableEdition = 'ed2Rev1' as const
	isPluginInitialized = $state(false)
	//====== STATES ======//

	rootElement = $derived(
		pluginGlobalStore.editionStores[this.currentEdition].rootElement
	)

	rootSubElements = $derived({
		...pluginGlobalStore.editionStores[this.currentEdition].rootSubElements
	})

	//====== ACTIONS ======//

	createElement(params: {
		tagName: string
		attributes?: Record<string, string | null>
		parent: Element
		reference?: Element
		innerHTML?: string
	}) {
		if (!pluginGlobalStore.xmlDocument)
			throw new Error('no xml document found')
		if (!pluginGlobalStore.host) throw new Error('no host element found')

		const newElement = pluginGlobalStore.xmlDocument.createElement(
			params.tagName
		)

		if (params.innerHTML) newElement.innerHTML = params.innerHTML

		if (params.attributes)
			for (const [name, value] of Object.entries(params.attributes)) {
				if (value === null) continue
				newElement.setAttribute(name, value)
			}

		createAndDispatchEditEvent({
			host: pluginGlobalStore.host,
			edit: {
				node: newElement,
				parent: params.parent,
				reference: params.reference || null
			}
		})

		return newElement
	}

	setUuidAttributesRecursively(element: Element) {
		if (
			!typeGuard.isTuplesIncludingString(
				element.tagName,
				ELEMENT_WITH_REQUIRED_UUID_ATTRIBUTES
			)
		)
			return

		const hasUuid = element.getAttribute('uuid')
		if (!hasUuid) element.setAttribute('uuid', crypto.randomUUID())

		for (const child of Array.from(element.children))
			this.setUuidAttributesRecursively(child)
	}

	addRequiredUuids() {
		if (!this.rootSubElements.ied) return

		for (const ied of Array.from(this.rootSubElements.ied)) {
			this.setUuidAttributesRecursively(ied)

			pluginGlobalStore.updateElement({
				element: ied,
				attributes: getAttributes(ied),
				attributesNS: getAttributesNS(ied)
			})
		}

		this.isPluginInitialized = true
	}
}

export const pluginLocalStore = new UsePluginLocalStore()
