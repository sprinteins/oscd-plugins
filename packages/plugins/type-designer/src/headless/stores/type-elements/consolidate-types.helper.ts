import { v4 as uuidv4 } from 'uuid'
// CORE
import {
	namedNodeMapAttributesToPlainObject,
	typeGuard
} from '@oscd-plugins/core-api/plugin/v1'
import { pluginGlobalStore } from '@oscd-plugins/core-ui-svelte'
// STORES
import { typeElementsStore, pluginLocalStore } from '@/headless/stores'
// CONSTANTS
import {
	TYPE_FAMILY_MAP,
	REF_FAMILY_TO_TYPE_FAMILY_MAP,
	TYPE_FAMILY_EQUIVALENT_FOR_ATTRIBUTES
} from '@/headless/constants'
// TYPES
import type {
	TypeElement,
	TypeElements,
	AvailableTypeFamily,
	MapTypeFamilyToDefinitionElement
} from '@/headless/stores'

function getTypeElementAttributes(
	family: AvailableTypeFamily,
	attributes: NamedNodeMap,
	elementId: string
) {
	let enforceIdentificationAttribute:
		| Record<'id', string>
		| Record<'uuid', string>

	if (family === TYPE_FAMILY_MAP.lNodeType)
		enforceIdentificationAttribute = { id: elementId }
	else enforceIdentificationAttribute = { uuid: elementId }

	return {
		...namedNodeMapAttributesToPlainObject({
			attributes,
			addAttributesFromDefinition: {
				element: TYPE_FAMILY_EQUIVALENT_FOR_ATTRIBUTES[family],
				currentEdition: pluginLocalStore.currentEdition,
				currentUnstableRevision:
					pluginLocalStore.currentUnstableRevision
			}
		}),
		...enforceIdentificationAttribute
	}
}

function getRefs(
	element: Element
): Record<AvailableTypeFamily, string[]> | Record<never, never> {
	if (element.tagName === 'LNodeType') return {}
	return Array.from(element.children).reduce(
		(acc, childElement) => {
			if (
				!typeGuard.isPropertyOfObject(
					childElement.tagName,
					typeElementsStore.mapRefTagNameToFamily
				)
			)
				return acc
			const tagName =
				typeElementsStore.mapRefTagNameToFamily[childElement.tagName]

			const typeFamily = REF_FAMILY_TO_TYPE_FAMILY_MAP[tagName]
			acc[typeFamily] = acc[typeFamily] || []

			//get LNodeType ids
			const lnType = childElement.getAttribute('lnType')
			if (lnType) acc[typeFamily].push(lnType)

			//get other Types uuids
			const type = childElement.getAttributeNS(
				pluginGlobalStore.revisionsStores[
					pluginLocalStore.currentUnstableRevision
				].currentNamespaceUri,
				'type'
			)
			if (type) acc[typeFamily].push(type)

			return acc
		},
		{} as Record<AvailableTypeFamily, string[]>
	)
}

export function getAndMapTypeElements<
	GenericFamily extends AvailableTypeFamily
>(
	family: GenericFamily,
	typeElements: MapTypeFamilyToDefinitionElement[GenericFamily][] | undefined
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
					attributes: getTypeElementAttributes(
						family,
						element.attributes,
						elementId
					),
					parameters: {
						label:
							element.getAttribute('name') ||
							element.getAttribute('id')
					},
					refs: getRefs(element)
				} as TypeElement<GenericFamily>
				return acc
			},
			{} as TypeElements<GenericFamily>
		) || {}
	)
}
