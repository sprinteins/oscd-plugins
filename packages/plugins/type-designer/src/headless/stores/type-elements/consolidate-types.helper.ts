import { v4 as uuidv4 } from 'uuid'
// CORE
import {
	namedNodeMapAttributesToPlainObject,
	typeGuard
} from '@oscd-plugins/core-api/plugin/v1'
// STORES
import { typeElementsStore, pluginLocalStore } from '@/headless/stores'
// CONSTANTS
import {
	TYPE_FAMILY_MAP,
	REF_FAMILY_TO_TYPE_FAMILY_MAP,
	TYPE_FAMILY_EQUIVALENT_FOR_ATTRIBUTES,
	REF_ATTRIBUTES_KIND_BY_REF_FAMILY,
	KIND
} from '@/headless/constants'
// TYPES
import type {
	TypeElement,
	TypeElementByIds,
	AvailableTypeFamily,
	// MapTypeFamilyToDefinitionElement,
	// Refs
	TypeRawElement,
	RefRawElement,
	RefElementsByFamily
} from '@/headless/stores'

/**
 * Retrieves the attributes of a type element
 *
 * @param params - The parameters for retrieving the type element attributes.
 * @param params.family - The family of the type element.
 * @param params.attributes - The NamedNodeMap of attributes to be converted.
 * @param params.elementId - The ID of the element to be enforced as an identification attribute.
 * @returns An object containing the attributes of the type element
 */
function getTypeElementAttributes(params: {
	family: AvailableTypeFamily
	attributes: NamedNodeMap
	elementId: string
}) {
	let enforceIdentificationAttribute:
		| Record<'id', string>
		| Record<'uuid', string>

	if (params.family === TYPE_FAMILY_MAP.lNodeType)
		enforceIdentificationAttribute = { id: params.elementId }
	else enforceIdentificationAttribute = { uuid: params.elementId }

	return {
		...namedNodeMapAttributesToPlainObject({
			attributes: params.attributes,
			addAttributesFromDefinition: {
				element: TYPE_FAMILY_EQUIVALENT_FOR_ATTRIBUTES[params.family],
				currentEdition: pluginLocalStore.currentEdition,
				currentUnstableRevision:
					pluginLocalStore.currentUnstableRevision
			}
		}),
		...enforceIdentificationAttribute
	}
}

function getRefs(element: Element): RefElementsByFamily {
	return Array.from(element.children).reduce(
		(acc, childElement) => {
			if (
				!typeGuard.isPropertyOfObject(
					childElement.tagName,
					typeElementsStore.mapRefTagNameToRefFamily
				)
			)
				return acc
			const refFamily =
				typeElementsStore.mapRefTagNameToRefFamily[childElement.tagName]

			let typeId = ''

			//get LNodeType ids
			const lnTypeAttribute = childElement.getAttribute('lnType')
			if (lnTypeAttribute) typeId = lnTypeAttribute

			//get other Types uuids
			const typeAttribute =
				REF_ATTRIBUTES_KIND_BY_REF_FAMILY[refFamily] === KIND.custom
					? childElement.getAttributeNS(
							pluginLocalStore.namespaces.currentPlugin.uri,
							'type'
						)
					: childElement.getAttribute('type')
			if (typeAttribute) typeId = typeAttribute

			if (!typeId) throw new Error('No id found for ref element')

			const typeFamily = REF_FAMILY_TO_TYPE_FAMILY_MAP[refFamily]

			acc[refFamily][uuidv4()] = {
				element: childElement as RefRawElement<typeof refFamily>,
				source: {
					id: typeId,
					family: typeFamily
				}
			} as RefElementsByFamily[typeof refFamily][string]
			return acc
		},
		{
			function: {},
			generalEquipment: {},
			conductingEquipment: {},
			eqFunction: {},
			lNode: {}
		} as RefElementsByFamily
	)
}

export function getAndMapTypeElements<
	GenericFamily extends AvailableTypeFamily
>(
	family: GenericFamily,
	typeElements: TypeRawElement<GenericFamily>[] | undefined
) {
	return (
		typeElements?.reduce(
			(acc, element) => {
				let elementId: string
				if (family === TYPE_FAMILY_MAP.lNodeType)
					elementId = element.getAttribute('id') || uuidv4()
				else elementId = element.getAttribute('uuid') || uuidv4()

				acc[elementId] = {
					element,
					attributes: getTypeElementAttributes({
						family,
						attributes: element.attributes,
						elementId
					}),
					parameters: {
						label:
							element.getAttribute('name') ||
							element.getAttribute('id')
					},
					refs: getRefs(element)
				} as TypeElement<GenericFamily>
				return acc
			},
			{} as TypeElementByIds<GenericFamily>
		) || {}
	)
}
