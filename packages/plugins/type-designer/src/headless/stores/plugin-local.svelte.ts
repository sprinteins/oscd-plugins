// CORE
import {
	getCurrentDefinition,
	findAllStandardElementsBySelector
} from '@oscd-plugins/core-api/plugin/v1'
import { pluginGlobalStore, ssdStore } from '@oscd-plugins/core-ui-svelte'
// TYPES
import type { IEC61850 } from '@oscd-plugins/core-standard'

class UsePluginLocalStore {
	//====== CONSTANTS ======//

	// CHANGE THESE VALUES TO MATCH YOUR PLUGIN
	currentEdition: IEC61850.AvailableEdition = 'ed2Rev1' as const
	currentUnstableRevision: IEC61850.AvailableUnstableRevision<
		typeof this.currentEdition
	> = 'IEC61850-90-30' as const

	pluginNamespacePrefix = 'type-designer' as const
	pluginNamespaceUri = 'https://transnetbw.de/type-designer' as const

	//====== STATES ======//

	host = $state<HTMLElement>()

	namespaces = $derived({
		currentPlugin: {
			uri: this.pluginNamespaceUri,
			prefix: this.pluginNamespacePrefix
		},
		currentUnstableRevision: {
			uri: pluginGlobalStore.revisionsStores[this.currentUnstableRevision]
				.currentNamespaceUri,
			prefix: pluginGlobalStore.revisionsStores[
				this.currentUnstableRevision
			].currentNamespacePrefix
		}
	})

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
		pluginGlobalStore.revisionsStores[this.currentUnstableRevision]
			.rootElement
	)

	rootSubElements = $derived({
		...pluginGlobalStore.editionStores[this.currentEdition].rootSubElements,
		...pluginGlobalStore.revisionsStores[this.currentUnstableRevision]
			.rootSubElements
	})

	bayTypeElements = $derived.by(() => {
		if (
			ssdStore.voltageLevelTemplateElement &&
			`${pluginGlobalStore.editCount}`
		)
			return findAllStandardElementsBySelector<
				'bay',
				typeof this.currentEdition
			>({
				selector: `${this.currentDefinition.bay.tag}[name]:not([name="TEMPLATE"])`,
				root: ssdStore.voltageLevelTemplateElement
			})
	})

	bayTemplateSubElements = $derived.by(() => {
		if (ssdStore.bayTemplateElement && `${pluginGlobalStore.editCount}`)
			return {
				generalEquipment: findAllStandardElementsBySelector<
					'generalEquipment',
					typeof this.currentEdition
				>({
					selector: this.currentDefinition.generalEquipment.tag,
					root: ssdStore.bayTemplateElement
				}),
				conductingEquipment: findAllStandardElementsBySelector<
					'conductingEquipment',
					typeof this.currentEdition
				>({
					selector: this.currentDefinition.conductingEquipment.tag,
					root: ssdStore.bayTemplateElement
				}),
				function: findAllStandardElementsBySelector<
					'function',
					typeof this.currentEdition
				>({
					selector: this.currentDefinition.function.tag,
					root: ssdStore.bayTemplateElement
				}),
				eqFunction: findAllStandardElementsBySelector<
					'eqFunction',
					typeof this.currentEdition
				>({
					selector: this.currentDefinition.eqFunction.tag,
					root: ssdStore.bayTemplateElement
				})
			}
	})

	dataTypeTemplatesSubElements = $derived({
		...pluginGlobalStore.editionStores[this.currentEdition]
			.dataTypeTemplatesSubElements
	})

	//====== METHODS ======//

	updateSCLVersion() {
		if (pluginGlobalStore.currentVersion === '2007C5') return
		if (this.rootElement)
			pluginGlobalStore.updateSCLVersion({
				rootElement: this.rootElement,
				version: '2007',
				revision: 'C',
				release: '5'
			})
	}

	addUnstableNamespaceToRootElement() {
		if (
			pluginGlobalStore.revisionsStores[this.currentUnstableRevision]
				.hasUnstableNamespace
		)
			return

		if (this.rootElement)
			pluginGlobalStore.addNamespaceToRootElement({
				rootElement: this.rootElement,
				namespace: this.namespaces.currentUnstableRevision
			})
	}
}

export const pluginLocalStore = new UsePluginLocalStore()
