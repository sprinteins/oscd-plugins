// CORE
import { pluginGlobalStore } from '@oscd-plugins/core-ui-svelte'
// TYPES
import type { IEC61850 } from '@oscd-plugins/core-standard'

class UsePluginLocalStore {
	//====== CONSTANTS ======//

	// CHANGE THESE VALUES TO MATCH YOUR PLUGIN
	currentEdition: IEC61850.AvailableEdition = 'ed2Rev1' as const

	//====== STATES ======//

	rootElement = $derived(
		pluginGlobalStore.editionStores[this.currentEdition].rootElement
	)

	rootSubElements = $derived({
		...pluginGlobalStore.editionStores[this.currentEdition].rootSubElements
	})
}

export const pluginLocalStore = new UsePluginLocalStore()
