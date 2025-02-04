import { createAndDispatchEditEvent } from '@oscd-plugins/core-api/plugin/v1'
// STORES
import { ed2Rev1Store, IEC61850_90_30Store } from './index.js'

class UsePluginGlobalStore {
	//====== STATES ======//

	xmlDocument: XMLDocument | undefined = $state.raw()
	xmlDocumentName: string | undefined = $state()
	editCount: number | undefined = $state()
	host: HTMLElement | undefined = $state()

	//====== DERIVED STATES ======//

	xmlDocumentExtension = $derived(this.xmlDocumentName?.split('.').pop())

	// STABLE EDITIONS
	editionStores = $derived({
		ed2Rev1: ed2Rev1Store
	})

	// UNSTABLE REVISIONS
	revisionsStores = $derived({
		'IEC61850-90-30': IEC61850_90_30Store
	})

	updateElementType({
		element,
		attributes,
		attributesNS
	}: {
		element: Element
		attributes?: Record<string, string | null>
		attributesNS?: Record<string, Record<string, string | null>>
	}) {
		if (!this.host) throw new Error('No host')
		createAndDispatchEditEvent({
			host: this.host,
			edit: {
				element,
				attributes: attributes || {},
				attributesNS: attributesNS || {}
			}
		})
	}
}

export const pluginGlobalStore = new UsePluginGlobalStore()
