import { v4 as uuidv4 } from 'uuid'
// CORE
import {
	createStandardElement,
	createCustomElement,
	createAndDispatchEditEvent,
	findAllStandardElementsBySelector
} from '@oscd-plugins/core-api/plugin/v1'
import { pluginGlobalStore } from '@oscd-plugins/core-ui-svelte'
// STORES
import {
	sidebarStore,
	pluginLocalStore,
	typeElementsStore
} from '@/headless/stores'
// CONSTANTS
import {
	TYPE_FAMILY_MAP,
	CUSTOM_TAG_NAME_MAP,
	TYPE_FAMILY_TO_REF_FAMILY_MAP,
	REF_FAMILY_MAP,
	REF_ATTRIBUTES_KIND_BY_REF_FAMILY,
	KIND
} from '@/headless/constants'
// TYPES
import type {
	AvailableTypeFamily,
	NewTypeAttributes,
	AvailableRefFamily
} from '@/headless/stores'

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
			namespace: pluginLocalStore.namespaces.currentPlugin,
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
				namespace: pluginLocalStore.namespaces.currentUnstableRevision
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

export function deleteType(params: {
	family: Exclude<AvailableTypeFamily, 'lNodeType'>
	id: string
}) {
	if (!pluginGlobalStore.host) throw new Error('No host')
	if (!pluginLocalStore.rootElement) throw new Error('No root element')

	if (params.family !== TYPE_FAMILY_MAP.bay)
		deleteAssociatedRefs({ family: params.family, id: params.id })

	createAndDispatchEditEvent({
		host: pluginGlobalStore.host,
		edit: {
			node: typeElementsStore.typeElementsPerFamily[params.family][
				params.id
			].element
		}
	})
}

function deleteAssociatedRefs(params: {
	family: Exclude<AvailableTypeFamily, 'bay' | 'lNodeType'>
	id: string
}) {
	if (!pluginGlobalStore.host) throw new Error('No host')
	if (!pluginLocalStore.rootElement) throw new Error('No root element')

	let refFamily: AvailableRefFamily

	if (params.family === TYPE_FAMILY_MAP.functionTemplate)
		refFamily =
			typeElementsStore.functionsIdsByType.eqFunctionsIds.includes(
				params.id
			)
				? REF_FAMILY_MAP.eqFunction
				: REF_FAMILY_MAP.function
	else refFamily = TYPE_FAMILY_TO_REF_FAMILY_MAP[params.family]

	const tagName = pluginLocalStore.currentDefinition[refFamily].tag

	const getAllRefElements = findAllStandardElementsBySelector({
		selector: `${tagName}`,
		root: pluginLocalStore.rootElement
	})

	for (const ref of getAllRefElements) {
		let shouldDeleteCurrentRef = false

		// standard element case
		if (ref.getAttribute('type') === params.id)
			shouldDeleteCurrentRef = true
		// element with custom attributes case
		if (
			REF_ATTRIBUTES_KIND_BY_REF_FAMILY[refFamily] === KIND.custom &&
			ref.getAttributeNS(
				pluginLocalStore.namespaces.currentPlugin.uri,
				'type'
			) === params.id
		)
			shouldDeleteCurrentRef = true

		if (shouldDeleteCurrentRef)
			createAndDispatchEditEvent({
				host: pluginGlobalStore.host,
				edit: {
					node: ref
				}
			})
	}
}
