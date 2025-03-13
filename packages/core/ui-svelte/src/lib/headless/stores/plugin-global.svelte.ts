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

	currentVersion = $derived.by(() => {
		if (`${pluginGlobalStore.editCount}`)
			return `${this.xmlDocument?.documentElement.getAttribute('version')}${this.xmlDocument?.documentElement.getAttribute('revision')}${this.xmlDocument?.documentElement.getAttribute('release')}`
	})

	updateElement(params: {
		element: Element
		attributes?: Record<string, string | null>
		attributesNS?: Record<string, Record<string, string | null>>
	}) {
		if (!this.host) throw new Error('No host')

		createAndDispatchEditEvent({
			host: this.host,
			edit: {
				element: params.element,
				attributes: params.attributes || {},
				attributesNS: params.attributesNS || {}
			}
		})
	}

	deleteElement(element: Element) {
		if (!pluginGlobalStore.host) throw new Error('No host')
		createAndDispatchEditEvent({
			host: pluginGlobalStore.host,
			edit: {
				node: element
			}
		})
	}

	addNamespaceToRootElement(args: {
		rootElement: Element
		namespace: {
			prefix: string
			uri: string
		}
	}) {
		args.rootElement.setAttributeNS(
			'http://www.w3.org/2000/xmlns/',
			`xmlns:${args.namespace.prefix}`,
			args.namespace.uri
		)
	}

	updateSCLVersion(args: {
		rootElement: Element
		version: string
		revision: string
		release: string
	}) {
		args.rootElement.setAttribute('version', args.version)
		args.rootElement.setAttribute('revision', args.revision)
		args.rootElement.setAttribute('release', args.release)
	}
}

export const pluginGlobalStore = new UsePluginGlobalStore()
