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

	isUsingIndexedDB = $state(false)
	// CHANGE THESE VALUES TO MATCH YOUR PLUGIN
	currentEdition: IEC61850.AvailableEdition = 'ed2Rev1' as const
	currentUnstableRevision: IEC61850.AvailableUnstableRevision<
		typeof this.currentEdition
	> = 'IEC61850-90-30' as const

	pluginNamespacePrefix = 'type-designer' as const
	pluginNamespaceUri = 'https://transnetbw.de/type-designer' as const

	//====== STATES ======//

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
