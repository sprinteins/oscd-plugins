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
import { pluginLocalStore, typeElementsStore } from '@/headless/stores'
// HELPERS
import { getNewNameWithOccurrence } from '@/headless/stores/type-elements/type-naming.helper'
import {
	createEquipmentTypeTemplates,
	createCurrentUnstableRevisionRootPrivateWrapper
} from '@/headless/stores/type-elements/wrapper.helper'
// CONSTANTS
import {
	TYPE_FAMILY_MAP,
	CUSTOM_TAG_NAME_MAP,
	TYPE_FAMILY_TO_COLUMN_KEY,
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
export function createNewType(params: {
	family: Exclude<AvailableTypeFamily, 'lNodeType'>
	attributes: NewTypeAttributes
}) {
	let eventPayload: { node: Element; parent: Element | null | undefined }

	switch (params.family) {
		case TYPE_FAMILY_MAP.bay:
			eventPayload = createBayType({
				family: params.family,
				attributes: params.attributes
			})
			break
		case TYPE_FAMILY_MAP.generalEquipmentType:
			eventPayload = createEquipmentType({
				family: params.family,
				attributes: params.attributes
			})
			break
		case TYPE_FAMILY_MAP.conductingEquipmentType:
			eventPayload = createEquipmentType({
				family: params.family,
				attributes: params.attributes
			})
			break
		case TYPE_FAMILY_MAP.functionTemplate:
			eventPayload = createFunctionTemplate({
				family: params.family,
				attributes: params.attributes
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
			namespace: pluginLocalStore.namespaces.currentPlugin,
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
				namespace: pluginLocalStore.namespaces.currentUnstableRevision
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
			reference: elementToClone.nextElementSibling
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
export function deleteTypeAndRefs(params: {
	family: Exclude<AvailableTypeFamily, 'lNodeType'>
	id: string
}) {
	if (!pluginGlobalStore.host) throw new Error('No host')
	if (!pluginLocalStore.rootElement) throw new Error('No root element')

	if (params.family !== TYPE_FAMILY_MAP.bay)
		deleteAssociatedRefs({ family: params.family, id: params.id })

	pluginGlobalStore.deleteElement(
		typeElementsStore.typeElementsPerFamily[params.family][params.id]
			.element
	)

	if (
		params.family === 'functionTemplate' &&
		pluginLocalStore.currentUnstableRevisionRootPrivateWrapper
			?.childElementCount === 0
	)
		pluginGlobalStore.deleteElement(
			pluginLocalStore.currentUnstableRevisionRootPrivateWrapper
		)

	if (
		(params.family === 'conductingEquipmentType' ||
			params.family === 'generalEquipmentType') &&
		pluginLocalStore.rootSubElements?.equipmentTypeTemplates
			?.childElementCount === 0 &&
		pluginLocalStore.rootSubElements.equipmentTypeTemplates?.parentElement
	)
		pluginGlobalStore.deleteElement(
			pluginLocalStore.rootSubElements.equipmentTypeTemplates
				.parentElement
		)
}

/**
 * Deletes associated references based on the provided parameters.
 *
 * @param params - The parameters for deleting associated references.
 * @param params.family - The family of the type to delete references for, excluding 'bay' and 'lNodeType'.
 * @param params.id - The ID of the type to delete references for.
 *
 * @throws Will throw an error if there is no host or root element available.
 */
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
