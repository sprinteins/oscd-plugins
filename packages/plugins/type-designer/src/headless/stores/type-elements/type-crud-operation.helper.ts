import { v4 as uuidv4 } from 'uuid'
// CORE
import {
	createStandardElement,
	createAndDispatchEditEvent,
	findAllStandardElementsBySelector
} from '@oscd-plugins/core-api/plugin/v1'
import { pluginGlobalStore, ssdStore } from '@oscd-plugins/core-ui-svelte'
// STORES
import { pluginLocalStore, typeElementsStore } from '@/headless/stores'
// HELPERS
import { getNewNameWithOccurrence } from '@/headless/stores/type-elements/type-naming.helper'
// CONSTANTS
import { TYPE_FAMILY } from '@/headless/constants'
// TYPES
import type {
	AvailableTypeFamily,
	TypeToCreateAttributes
} from '@/headless/stores'

//====== CREATE ======//

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
	attributes: TypeToCreateAttributes
}) {
	pluginLocalStore.updateSCLVersion()
	ssdStore.createTemplateWrapper()

	if (!pluginGlobalStore.host) throw new Error('No host')
	if (!pluginGlobalStore.xmlDocument) throw new Error('No XML document')

	const newTypeElement = createStandardElement({
		xmlDocument: pluginGlobalStore.xmlDocument,
		element: { family: params.family },
		attributes: {
			...params.attributes,
			uuid: uuidv4()
		},
		currentEdition: pluginLocalStore.currentEdition,
		currentUnstableRevision: pluginLocalStore.currentUnstableRevision
	})

	const parent =
		params.family === TYPE_FAMILY.bay
			? ssdStore.voltageLevelTemplateElement
			: ssdStore.bayTemplateElement
	if (!parent) throw new Error('No parent element available for the new type')

	createAndDispatchEditEvent({
		host: pluginGlobalStore.host,
		edit: {
			parent,
			node: newTypeElement,
			reference: null
		}
	})
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

	if (!pluginGlobalStore.host) throw new Error('No host')
	if (!elementToClone.parentElement) throw new Error('No parent element')

	createAndDispatchEditEvent({
		host: pluginGlobalStore.host,
		edit: {
			parent: elementToClone.parentElement,
			node: clonedElement,
			reference: elementToClone.nextElementSibling
		}
	})
}

//====== DELETE ======//

export function deleteTypeAndRefs(params: {
	family: Exclude<AvailableTypeFamily, 'lNodeType'>
	id: string
}) {
	if (params.family !== TYPE_FAMILY.bay)
		deleteAssociatedRefs({ family: params.family, id: params.id })

	pluginGlobalStore.deleteElement(
		typeElementsStore.typeElementsPerFamily[params.family][params.id]
			.element
	)

	ssdStore.cleanTemplateWrapper()
}

function deleteAssociatedRefs(params: {
	family: Exclude<AvailableTypeFamily, 'bay' | 'lNodeType'>
	id: string
}) {
	if (!pluginLocalStore.rootElement) throw new Error('No root element')

	const refFamily =
		typeElementsStore.typeElementsPerFamily[params.family][params.id]
			.parameters.refFamily

	if (!refFamily) return

	const tagName = pluginLocalStore.currentDefinition[refFamily].tag

	const getAllRefElements = findAllStandardElementsBySelector({
		selector: tagName,
		root: pluginLocalStore.rootElement
	})

	for (const ref of getAllRefElements) {
		if (ref.getAttribute('templateUuid') === params.id)
			pluginGlobalStore.deleteElement(ref)
	}
}
