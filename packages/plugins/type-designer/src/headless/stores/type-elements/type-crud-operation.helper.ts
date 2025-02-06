import { v4 as uuidv4 } from 'uuid'
// CORE
import {
	createStandardElement,
	createCustomElement,
	createAndDispatchEditEvent
} from '@oscd-plugins/core-api/plugin/v1'
import { pluginGlobalStore } from '@oscd-plugins/core-ui-svelte'
// STORES
import {
	sidebarStore,
	pluginLocalStore,
	typeElementsStore
} from '@/headless/stores'
// CONSTANTS
import { TYPE_FAMILY_MAP, CUSTOM_TAG_NAME_MAP } from '@/headless/constants'
// TYPES
import type { AvailableTypeFamily, NewTypeAttributes } from '@/headless/stores'
import type { Xml } from '@oscd-plugins/core-api/plugin/v1'

//====== CREATE ======//

//////// WRAPPER

export function createNewType({
	family,
	attributes
}: {
	family: Exclude<AvailableTypeFamily, 'lNodeType'>
	attributes: NewTypeAttributes
}) {
	let eventPayload: { node: Element; parent: Element | null | undefined }

	switch (family) {
		case TYPE_FAMILY_MAP.bay:
			eventPayload = createBayType({
				family,
				attributes
			})
			break
		case TYPE_FAMILY_MAP.generalEquipmentType:
			eventPayload = createEquipmentType({
				family,
				attributes
			})
			break
		case TYPE_FAMILY_MAP.conductingEquipmentType:
			eventPayload = createEquipmentType({
				family,
				attributes
			})
			break
		case TYPE_FAMILY_MAP.functionTemplate:
			eventPayload = createFunctionTemplate({
				family,
				attributes
			})
			break
	}

	if (!pluginGlobalStore.host) throw new Error('No host')
	if (!eventPayload.parent) throw new Error('No parent element')

	createAndDispatchEditEvent({
		host: pluginGlobalStore.host,
		edit: {
			parent: eventPayload.parent,
			node: eventPayload.node,
			reference: null
		}
	})
}

//////// WRAPPER SUB FUNCTION

export function createBayType({
	family,
	attributes
}: {
	family: typeof TYPE_FAMILY_MAP.bay
	attributes: NewTypeAttributes
}) {
	if (!pluginGlobalStore.xmlDocument) throw new Error('No XML document')

	return {
		node: createStandardElement({
			xmlDocument: pluginGlobalStore.xmlDocument,
			element: { family },
			attributes: {
				...attributes,
				uuid: uuidv4()
			},
			currentEdition: pluginLocalStore.currentEdition,
			currentUnstableRevision: pluginLocalStore.currentUnstableRevision
		}),
		parent: pluginLocalStore.substationsSubElements?.[0].voltageLevel?.[0]
	}
}

export function createEquipmentType({
	family,
	attributes
}: {
	family:
		| typeof TYPE_FAMILY_MAP.generalEquipmentType
		| typeof TYPE_FAMILY_MAP.conductingEquipmentType
	attributes: NewTypeAttributes
}) {
	if (!pluginGlobalStore.xmlDocument) throw new Error('No XML document')

	return {
		node: createCustomElement({
			xmlDocument: pluginGlobalStore.xmlDocument,
			tagName: CUSTOM_TAG_NAME_MAP[family],
			namespace: {
				uri: pluginLocalStore.pluginNamespaceUri,
				prefix: pluginLocalStore.pluginNamespacePrefix
			},
			attributes: {
				...attributes,
				uuid: uuidv4()
			}
		}),
		parent: pluginLocalStore.rootSubElements?.equipmentTypeTemplates
	}
}

export function createFunctionTemplate({
	family,
	attributes
}: {
	family: typeof TYPE_FAMILY_MAP.functionTemplate
	attributes: NewTypeAttributes
}) {
	if (!pluginGlobalStore.xmlDocument) throw new Error('No XML document')

	return {
		node: createStandardElement({
			xmlDocument: pluginGlobalStore.xmlDocument,
			element: {
				family,
				namespace: {
					uri: pluginGlobalStore.revisionsStores[
						pluginLocalStore.currentUnstableRevision
					].currentNamespaceUri,
					prefix: pluginGlobalStore.revisionsStores[
						pluginLocalStore.currentUnstableRevision
					].currentNamespacePrefix
				}
			},
			attributes: {
				...attributes,
				uuid: uuidv4()
			},
			currentEdition: pluginLocalStore.currentEdition,
			currentUnstableRevision: pluginLocalStore.currentUnstableRevision,
			wrapWithPrivateElement: true
		}),
		parent: pluginLocalStore.rootElement
	}
}

//====== UPDATE ======//

export function updateType(attributeKey: string) {
	if (!pluginGlobalStore.host) throw new Error('No host')
	if (!sidebarStore.currentElementType)
		throw new Error('No current element type')

	createAndDispatchEditEvent({
		host: pluginGlobalStore.host,
		edit: {
			element: sidebarStore.currentElementType.element,
			attributes: {
				[attributeKey]:
					sidebarStore.currentElementType.attributes[attributeKey]
			},
			attributesNS: {}
		}
	})
}

//====== DELETE ======//

export function deleteType({
	family,
	id
}: { family: Exclude<AvailableTypeFamily, 'lNodeType'>; id: string }) {
	if (!pluginGlobalStore.host) throw new Error('No host')
	console.log('deleteType', family, id)
	console.log(typeElementsStore.typeElementsPerFamily[family][id].element)
	createAndDispatchEditEvent({
		host: pluginGlobalStore.host,
		edit: {
			node: typeElementsStore.typeElementsPerFamily[family][id].element
		}
	})
}
