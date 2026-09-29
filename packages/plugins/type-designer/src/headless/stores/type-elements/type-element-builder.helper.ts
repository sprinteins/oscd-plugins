// CORE
import { namedNodeMapAttributesToPlainObject } from '@oscd-plugins/core-api/plugin/v1'
// CONSTANTS
import { TYPE_FAMILY, TYPE_ID_ATTRIBUTE } from '@/headless/constants'
// TYPES
import type {
	AvailableTypeFamily,
	CorruptedTypeElement,
	TypeRawElement
} from '@/headless/stores'
// STORES
import { pluginLocalStore } from '@/headless/stores'
// HELPERS
import { getEmptyRefs } from '@/headless/stores/type-elements/ref-mapping.helper'

/**
 * Retrieves the attributes of a type element
 *
 * @param params - The parameters for retrieving the type element attributes.
 * @param params.family - The family of the type element.
 * @param params.attributes - The NamedNodeMap of attributes to be converted.
 * @param params.elementId - The ID of the element to be enforced as an identification attribute.
 * @returns An object containing the attributes of the type element
 */
export function getTypeElementAttributes(params: {
	family: AvailableTypeFamily
	attributes: NamedNodeMap
	elementId: string
}) {
	let enforceIdentificationAttribute:
		| Record<'id', string>
		| Record<'uuid', string>

	if (params.family === TYPE_FAMILY.lNodeType)
		enforceIdentificationAttribute = { id: params.elementId }
	else enforceIdentificationAttribute = { uuid: params.elementId }

	return {
		...namedNodeMapAttributesToPlainObject({
			attributes: params.attributes,
			addAttributesFromDefinition: {
				element: TYPE_FAMILY[params.family],
				currentEdition: pluginLocalStore.currentEdition,
				currentUnstableRevision:
					pluginLocalStore.currentUnstableRevision
			}
		}),
		...enforceIdentificationAttribute
	}
}

export function getLabel(element: Element): string {
	return (
		element.getAttribute('name') ||
		element.getAttribute('id') ||
		'Invalid SCL element'
	)
}

function getCorruptedChildrenOptions(): CorruptedTypeElement<AvailableTypeFamily>['parameters']['childrenOptions'] {
	return {
		bay: undefined,
		generalEquipment: undefined,
		conductingEquipment: undefined,
		function: undefined,
		lNodeType: undefined
	}
}

export function buildCorruptedTypeElement<
	GenericFamily extends AvailableTypeFamily
>(params: {
	family: GenericFamily
	element: TypeRawElement<GenericFamily>
	elementId: string
	originalId: string | null
	corruptionReason: string
}): CorruptedTypeElement<GenericFamily> {
	const identifierAttribute = TYPE_ID_ATTRIBUTE[params.family]

	return {
		element: params.element,
		corruptionReason: params.corruptionReason,
		attributes: {
			...Object.fromEntries(
				Array.from(params.element.attributes, ({ name, value }) => [
					name,
					value
				])
			),
			[identifierAttribute]: params.originalId || params.elementId
		},
		parameters: {
			label: getLabel(params.element),
			refFamily: undefined,
			childrenOptions: getCorruptedChildrenOptions()
		},
		refs: getEmptyRefs()
	}
}
