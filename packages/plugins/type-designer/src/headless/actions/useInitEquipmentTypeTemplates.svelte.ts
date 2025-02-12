// CORE
import { pluginGlobalStore } from '@oscd-plugins/core-ui-svelte'
import {
	createCustomElement,
	createAndDispatchEditEvent
} from '@oscd-plugins/core-api/plugin/v1'
// STORE
import { pluginLocalStore } from '@/headless/stores/index.js'

export function initEquipmentTypeTemplates(node: HTMLElement) {
	//====== FUNCTIONS ======//

	function createEquipmentTypeTemplates() {
		if (!pluginGlobalStore.host) throw new Error('No host')
		if (!pluginGlobalStore.xmlDocument) throw new Error('No XML document')
		if (!pluginLocalStore.rootElement) throw new Error('No root element')

		const newElement = createCustomElement({
			xmlDocument: pluginGlobalStore.xmlDocument,
			tagName: 'EquipmentTypeTemplates',
			namespace: {
				uri: pluginLocalStore.pluginNamespaceUri,
				prefix: pluginLocalStore.pluginNamespacePrefix
			},
			wrapWithPrivateElement: true
		})

		createAndDispatchEditEvent({
			host: pluginGlobalStore.host,
			edit: {
				node: newElement,
				parent: pluginLocalStore.rootElement,
				reference:
					pluginLocalStore.rootSubElements?.dataTypeTemplates || null
			}
		})
	}

	$effect(() => {
		if (!pluginLocalStore.rootSubElements?.equipmentTypeTemplates)
			createEquipmentTypeTemplates()
	})
}
