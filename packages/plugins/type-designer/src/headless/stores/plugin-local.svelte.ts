// CORE
import {
	getCurrentDefinition,
	findAllStandardElementsBySelector,
	findOneCustomElement,
	findAllCustomElement
} from '@oscd-plugins/core-api/plugin/v1'
import { pluginGlobalStore } from '@oscd-plugins/core-ui-svelte'
// TYPES
import type { Xml } from '@oscd-plugins/core-api/plugin/v1'
import type { IEC61850 } from '@oscd-plugins/core-standard'

class UsePluginLocalStore {
	//====== CONSTANTS ======//

	// CHANGE THESE VALUES TO MATCH YOUR PLUGIN
	currentEdition: IEC61850.AvailableEdition = 'ed2Rev1'
	currentUnstableRevision: IEC61850.AvailableUnstableRevision<
		typeof this.currentEdition
	> = 'IEC61850-90-30'

	pluginNamespacePrefix = 'type-designer'
	pluginNamespaceUri = 'https://transnetbw.de/type-designer'

	//====== STATES ======//

	host = $state<HTMLElement>()

	currentDefinition = $derived(
		getCurrentDefinition({
			currentEdition: this.currentEdition,
			currentUnstableRevision: this.currentUnstableRevision
		}) as IEC61850.CurrentDefinition<
			typeof this.currentEdition,
			typeof this.currentUnstableRevision
		>
	)

	rootElement = $derived(
		this.currentEdition &&
			pluginGlobalStore.revisionsStores[this.currentUnstableRevision]
				.rootElement
	)

	rootSubElements = $derived({
		...(this.currentEdition &&
			pluginGlobalStore.editionStores[this.currentEdition]
				.rootSubElements),
		...(this.currentUnstableRevision &&
			pluginGlobalStore.revisionsStores[this.currentUnstableRevision]
				.rootSubElements),
		...(this.rootElement && {
			equipmentTypeTemplates: findOneCustomElement({
				selector: 'EquipmentTypeTemplates',
				root: this.rootElement
			})
		})
	})

	substationsSubElements = $derived([
		...((this.currentEdition &&
			pluginGlobalStore.editionStores[this.currentEdition]
				?.substationsSubElements) ||
			[])
	])

	templateBaysSubElements:
		| Xml.SclElement<
				'bay',
				typeof this.currentEdition,
				typeof this.currentUnstableRevision
		  >[]
		| undefined = $derived.by(() => {
		if (
			this.substationsSubElements?.[0]?.voltageLevel?.[0]?.getAttribute(
				'name'
			) === 'TEMPLATE' &&
			this.currentDefinition
		)
			return findAllStandardElementsBySelector<
				'bay',
				typeof this.currentEdition
			>({
				selector: this.currentDefinition.bay.tag,
				root: this.substationsSubElements[0]?.voltageLevel[0]
			})
	})

	equipmentTypeTemplatesSubElements = $derived.by(() => {
		// needed to trigger reactivity
		if (
			this.rootSubElements?.equipmentTypeTemplates &&
			`${pluginGlobalStore.editCount}`
		)
			return {
				generalEquipmentType: findAllCustomElement({
					selector: 'GeneralEquipmentType',
					root: this.rootSubElements.equipmentTypeTemplates
				}) as Xml.SclCustomElement<'GeneralEquipmentType'>[],
				conductingEquipmentType: findAllCustomElement({
					selector: 'ConductingEquipmentType',
					root: this.rootSubElements?.equipmentTypeTemplates
				}) as Xml.SclCustomElement<'ConductingEquipmentType'>[]
			}
	})

	dataTypeTemplatesSubElements = $derived({
		...(this.currentEdition &&
			pluginGlobalStore.editionStores[this.currentEdition]
				.dataTypeTemplatesSubElements)
	})
}

export const pluginLocalStore = new UsePluginLocalStore()
