// CORE
import { pluginGlobalStore } from '@oscd-plugins/core-ui-svelte'
import {
	createStandardElement,
	createCustomElement,
	createAndDispatchEditEvent
} from '@oscd-plugins/core-api/plugin/v1'
// STORE
import { pluginLocalStore } from '@/headless/stores/index.js'

function addNamespaceToRootElement(args: { prefix: string; uri: string }) {
	pluginLocalStore.rootElement?.setAttributeNS(
		'http://www.w3.org/2000/xmlns/',
		`xmlns:${args.prefix}`,
		args.uri
	)
}

/**
 * Creates a new root private wrapper element and dispatch an edit event to create it in the XML document.
 *
 * @throws If the `host`, `xmlDocument`, or `rootElement` properties are not available in the respective stores.
 * @returns The newly created private wrapper element.
 */
export function createCurrentUnstableRevisionRootPrivateWrapper() {
	if (!pluginGlobalStore.host) throw new Error('No host')
	if (!pluginGlobalStore.xmlDocument) throw new Error('No XML document')
	if (!pluginLocalStore.rootElement) throw new Error('No root element')

	addNamespaceToRootElement(
		pluginLocalStore.namespaces.currentUnstableRevision
	)

	const newPrivateWrapper = createStandardElement({
		xmlDocument: pluginGlobalStore.xmlDocument,
		currentEdition: pluginLocalStore.currentEdition,
		currentUnstableRevision: pluginLocalStore.currentUnstableRevision,
		element: {
			family: 'private'
		},
		attributes: {
			type: pluginGlobalStore.revisionsStores[
				pluginLocalStore.currentUnstableRevision
			].currentNamespacePrefix
		}
	})

	createAndDispatchEditEvent({
		host: pluginGlobalStore.host,
		edit: {
			node: newPrivateWrapper,
			parent: pluginLocalStore.rootElement,
			reference: pluginLocalStore.rootSubElements?.header || null
		}
	})

	return newPrivateWrapper
}

/**
 * Creates a new EquipmentTypeTemplates element and dispatches an edit event to create it in the XML document.
 *
 * @throws If the host, XML document, or root element is not available.
 * @returns The first child element of the newly created EquipmentTypeTemplates element, or null if there are no children.
 */
export function createEquipmentTypeTemplates() {
	if (!pluginGlobalStore.host) throw new Error('No host')
	if (!pluginGlobalStore.xmlDocument) throw new Error('No XML document')
	if (!pluginLocalStore.rootElement) throw new Error('No root element')

	addNamespaceToRootElement(pluginLocalStore.namespaces.currentPlugin)

	const newEquipmentTypeTemplatesWrapper = createCustomElement({
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
			node: newEquipmentTypeTemplatesWrapper,
			parent: pluginLocalStore.rootElement,
			reference: pluginLocalStore.rootSubElements?.header || null
		}
	})

	return newEquipmentTypeTemplatesWrapper.firstElementChild
}
