import { tick } from 'svelte'
// CORE
import {
	findOneStandardElementBySelector,
	createStandardElement,
	createAndDispatchEditEvent
} from '@oscd-plugins/core-api/plugin/v1'
// STORES
import { pluginGlobalStore, ed2Rev1Store } from '../index.js'
// TYPES
import type { Xml } from '@oscd-plugins/core-api/plugin/v1'

class UseSsdStore {
	//====== STATES ======//

	substationTemplateElement:
		| Xml.SclElement<'substation', 'ed2Rev1', undefined>
		| null
		| undefined = $derived.by(() => {
		// needed to trigger reactivity
		if (`${pluginGlobalStore.editCount}`)
			return this.getTemplateElement('Substation')
	})

	voltageLevelTemplateElement:
		| Xml.SclElement<'voltageLevel', 'ed2Rev1', undefined>
		| null
		| undefined = $derived.by(() => {
		// needed to trigger reactivity
		if (`${pluginGlobalStore.editCount}`)
			return this.getTemplateElement('VoltageLevel')
	})

	bayTemplateElement:
		| Xml.SclElement<'bay', 'ed2Rev1', undefined>
		| null
		| undefined = $derived.by(() => {
		// needed to trigger reactivity
		if (`${pluginGlobalStore.editCount}`)
			return this.getTemplateElement('Bay')
	})

	templateElementPayload = $derived({
		substation: {
			tag: 'Substation',
			parent: ed2Rev1Store.rootElement,
			reference:
				ed2Rev1Store.rootSubElements?.header?.nextElementSibling || null
		},
		voltageLevel: {
			tag: 'VoltageLevel',
			parent: this.substationTemplateElement,
			reference:
				ed2Rev1Store.rootSubElements?.substation?.[0]
					?.nextElementSibling || null
		},
		bay: {
			tag: 'Bay',
			parent: this.voltageLevelTemplateElement,
			reference:
				ed2Rev1Store.substationsSubElements?.[0]?.voltageLevel?.[0]
					?.nextElementSibling || null
		}
	})

	hasTemplateWrapper = $derived(
		!!(
			this.substationTemplateElement &&
			this.voltageLevelTemplateElement &&
			this.bayTemplateElement
		)
	)

	//====== METHODS ======//

	getTemplateElement<Family extends 'substation' | 'voltageLevel' | 'bay'>(
		elementTag: 'Substation' | 'VoltageLevel' | 'Bay'
	) {
		if (ed2Rev1Store.rootElement)
			return findOneStandardElementBySelector<
				Family,
				typeof ed2Rev1Store.currentEditionName
			>({
				selector: `${elementTag}[name=TEMPLATE]`,
				root: ed2Rev1Store.rootElement
			})
	}

	async createTemplateElement(
		templateElementToCreate: 'substation' | 'voltageLevel' | 'bay'
	) {
		const host = pluginGlobalStore.host
		if (!host) throw new Error('No host')

		await tick()

		const parent =
			this.templateElementPayload[templateElementToCreate].parent
		if (!parent)
			throw new Error(
				'No parent element found when creating template element'
			)
		const reference =
			this.templateElementPayload[templateElementToCreate].reference
		if (!pluginGlobalStore.xmlDocument) throw new Error('No XML document')

		const newTemplateElement = createStandardElement({
			xmlDocument: pluginGlobalStore.xmlDocument,
			element: {
				family: templateElementToCreate
			},
			attributes: {
				name: 'TEMPLATE',
				desc: 'Template Container'
			},
			currentEdition: ed2Rev1Store.currentEditionName
		})

		createAndDispatchEditEvent({
			host: host,
			edit: {
				node: newTemplateElement,
				parent,
				reference
			}
		})

		return newTemplateElement
	}

	async createTemplateWrapper() {
		if (!this.substationTemplateElement)
			await this.createTemplateElement('substation')
		if (!this.voltageLevelTemplateElement)
			await this.createTemplateElement('voltageLevel')
		if (!this.bayTemplateElement) await this.createTemplateElement('bay')
	}

	cleanTemplateWrapper() {
		if (this.bayTemplateElement?.childElementCount === 0)
			pluginGlobalStore.deleteElement(this.bayTemplateElement)

		if (this.voltageLevelTemplateElement?.childElementCount === 0)
			pluginGlobalStore.deleteElement(this.voltageLevelTemplateElement)

		if (this.substationTemplateElement?.childElementCount === 0)
			pluginGlobalStore.deleteElement(this.substationTemplateElement)
	}
}

export const ssdStore = new UseSsdStore()
