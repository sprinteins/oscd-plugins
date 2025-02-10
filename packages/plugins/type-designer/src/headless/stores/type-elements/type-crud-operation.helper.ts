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
// HELPERS
import { getNewNameWithOccurrence } from '@/headless/stores/type-elements/type-naming.helper'
import {
	createEquipmentTypeTemplates,
	deleteEquipmentTypeTemplates,
	createCurrentUnstableRevisionRootPrivateWrapper,
	deleteCurrentUnstableRevisionRootPrivateWrapper
} from '@/headless/stores/type-elements/wrapper.helper'
// CONSTANTS
import {
	TYPE_FAMILY_MAP,
	CUSTOM_TAG_NAME_MAP,
	TYPE_FAMILY_TO_COLUMN_KEY
} from '@/headless/constants'
// TYPES
import type { AvailableTypeFamily, NewTypeAttributes } from '@/headless/stores'

//====== CREATE ======//

//////// WRAPPER

/**
 * Creates a new type based on the provided family and attributes.
 * Dispatches an edit event with the created type.
 *
 * @param params - The parameters for creating a new type.
 * @param params.family - The family of the type to be created.
 * @param params.attributes - The attributes for the new type.
 *
 * @throws If there is no host or no parent element.
 */
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

/**
 * Creates a new Bay type element.
 *
 * @param params - The parameters for creating the Bay type.
 * @param params.family - The family type of the Bay.
 * @param params.attributes - The attributes for the new Bay type.
 * @returns An object containing the created Bay node and its parent element.
 * @throws If there is no XML document in the global store.
 */
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
		parent: typeElementsStore.parentElementWrapperPerColumnKey.bay
	}
}

/**
 * Creates a new equipment type element.
 *
 * @param params - The parameters for creating the equipment type.
 * @param params.family - The family type of the equipment.
 * @param params.attributes - The attributes for the new equipment type.
 * @returns An object containing the created EquipmentType node and its parent element.
 * @throws If there is no XML document available in the global store.
 */
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

	let parent =
		typeElementsStore.parentElementWrapperPerColumnKey
			.equipmentTypeTemplates

	if (!parent) parent = createEquipmentTypeTemplates()

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
		parent
	}
}

/**
 * Creates a function template element.
 *
 * @param params - The parameters for creating the function template.
 * @param params.family - The family type of the function template.
 * @param params.attributes - The attributes for the new type.
 * @returns An object containing the created FunctionTemplate node and its parent element.
 * @throws If there is no XML document available in the global store.
 */
export function createFunctionTemplate({
	family,
	attributes
}: {
	family: typeof TYPE_FAMILY_MAP.functionTemplate
	attributes: NewTypeAttributes
}) {
	if (!pluginGlobalStore.xmlDocument) throw new Error('No XML document')

	let parent =
		typeElementsStore.parentElementWrapperPerColumnKey.functionTemplate

	if (!parent) parent = createCurrentUnstableRevisionRootPrivateWrapper()

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
			currentUnstableRevision: pluginLocalStore.currentUnstableRevision
		}),
		parent
	}
}

/**
 * Duplicates a type element by cloning it and assigning a new unique identifier and name.
 *
 * @param params - The parameters for the duplication.
 * @param params.family - The family of the type element to duplicate.
 * @param params.id - The identifier of the type element to duplicate.
 *
 * @throws If there is no host or parent element.
 */
export function duplicateType({
	family,
	id
}: { family: Exclude<AvailableTypeFamily, 'lNodeType'>; id: string }) {
	const elementToClone =
		typeElementsStore.typeElementsPerFamily[family][id].element
	const clonedElement = elementToClone.cloneNode(true) as Element

	clonedElement.setAttribute('uuid', uuidv4())
	clonedElement.setAttribute(
		'name',
		getNewNameWithOccurrence({ elementToClone, family })
	)

	const currentParent =
		typeElementsStore.parentElementWrapperPerColumnKey[
			TYPE_FAMILY_TO_COLUMN_KEY[family]
		]

	if (!pluginGlobalStore.host) throw new Error('No host')
	if (!currentParent) throw new Error('No parent element')

	createAndDispatchEditEvent({
		host: pluginGlobalStore.host,
		edit: {
			parent: currentParent,
			node: clonedElement,
			reference: clonedElement.nextElementSibling
		}
	})
}

//====== UPDATE ======//

/**
 * Updates the type of the current element by dispatching an edit event.
 *
 * @param attributeKey - The key of the attribute to update.
 * @throws Will throw an error if there is no host or no current element type.
 */
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

/**
 * Deletes a type element and performs necessary cleanup operations.
 *
 * @param params - The parameters for the delete operation.
 * @param params.family - The family of the type element to delete.
 * @param params.id - The ID of the type element to delete.
 *
 * @throws If there is no host available in the plugin global store.
 *
 * @remarks
 * This function performs the following operations:
 * - Dispatches an edit event to remove the type element.
 * - If the family is 'functionTemplate' and the current unstable revision root private wrapper element has no children, it deletes it.
 * - If the family is 'conductingEquipmentType' or 'generalEquipmentType' and the EquipmentTypeTemplates element has no children, it deletes it.
 */
export function deleteType({
	family,
	id
}: { family: Exclude<AvailableTypeFamily, 'lNodeType'>; id: string }) {
	if (!pluginGlobalStore.host) throw new Error('No host')

	createAndDispatchEditEvent({
		host: pluginGlobalStore.host,
		edit: {
			node: typeElementsStore.typeElementsPerFamily[family][id].element
		}
	})

	if (
		family === 'functionTemplate' &&
		pluginLocalStore.currentUnstableRevisionRootPrivateWrapper
			?.childElementCount === 0
	)
		deleteCurrentUnstableRevisionRootPrivateWrapper()

	if (
		(family === 'conductingEquipmentType' ||
			family === 'generalEquipmentType') &&
		pluginLocalStore.rootSubElements?.equipmentTypeTemplates
			?.childElementCount === 0
	)
		deleteEquipmentTypeTemplates()
}
