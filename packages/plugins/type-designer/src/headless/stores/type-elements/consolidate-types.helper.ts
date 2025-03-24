import { v4 as uuidv4 } from 'uuid'
// CORE
import {
	findAllCustomElementBySelector,
	namedNodeMapAttributesToPlainObject,
	typeGuard
} from '@oscd-plugins/core-api/plugin/v1'
// STORES
import { typeElementsStore, pluginLocalStore } from '@/headless/stores'
// CONSTANTS
import {
	REF_FAMILY,
	TYPE_FAMILY,
	TYPE_ID_ATTRIBUTE,
	REF_FAMILY_TO_TYPE_FAMILY_MAP
} from '@/headless/constants'
// TYPES
import type {
	AvailableRefFamily,
	TypeElement,
	TypeElementByIds,
	AvailableTypeFamily,
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
			//get other Types uuids
			const templateUuidAttribute =
				childElement.getAttribute('templateUuid')

			if (lnTypeAttribute) typeId = lnTypeAttribute
			else if (templateUuidAttribute) typeId = templateUuidAttribute

			if (!typeId) throw new Error('No id found for ref element')

			const typeFamily = REF_FAMILY_TO_TYPE_FAMILY_MAP[refFamily]

			const refOccurrence =
				Object.values(acc[refFamily]).filter(
					(ref) => ref.source.id === typeId
				).length + 1

			acc[refFamily][uuidv4()] = {
				element: childElement as RefRawElement<typeof refFamily>,
				source: {
					id: typeId,
					family: typeFamily
				},
				occurrence: refOccurrence
			} as RefElementsByFamily[typeof refFamily][string]
			return acc
		},
		{
			generalEquipment: {},
			conductingEquipment: {},
			function: {},
			eqFunction: {},
			lNode: {}
		} as RefElementsByFamily
	)
}

function getRefFamilyByChildren(elementId: string, rootElement?: Element) {
	if (!rootElement) throw new Error('No root element')
	const match = findAllCustomElementBySelector({
		selector: `[templateUuid="${elementId}"]`,
		root: rootElement
	})

	if (!match.length) return undefined
	if (
		typeGuard.isPropertyOfObject(
			match[0].tagName,
			typeElementsStore.mapRefTagNameToRefFamily
		)
	)
		return typeElementsStore.mapRefTagNameToRefFamily[match[0].tagName]
}

function getRefFamily(
	typeFamily: AvailableTypeFamily,
	elementId: string,
	rootElement?: Element
): AvailableRefFamily | undefined {
	return {
		[TYPE_FAMILY.bay]: () => undefined,
		[TYPE_FAMILY.generalEquipment]: () => REF_FAMILY.generalEquipment,
		[TYPE_FAMILY.conductingEquipment]: () => REF_FAMILY.conductingEquipment,
		[TYPE_FAMILY.function]: () =>
			getRefFamilyByChildren(elementId, rootElement),
		[TYPE_FAMILY.lNodeType]: () => REF_FAMILY.lNode
	}[typeFamily]()
}

export function getAndMapTypeElements<
	GenericFamily extends AvailableTypeFamily
>(params: {
	family: GenericFamily
	typeElements: TypeRawElement<GenericFamily>[] | undefined
	rootElement?: Element
}) {
	return (
		params.typeElements?.reduce(
			(acc, element) => {
				const elementId =
					element.getAttribute(TYPE_ID_ATTRIBUTE[params.family]) ||
					uuidv4()

				acc[elementId] = {
					element,
					attributes: getTypeElementAttributes({
						family: params.family,
						attributes: element.attributes,
						elementId
					}),
					parameters: {
						label:
							element.getAttribute('name') ||
							element.getAttribute('id') ||
							'This element has no name or no id',
						refFamily: getRefFamily(
							params.family,
							elementId,
							params.rootElement
						)
					},
					refs: getRefs(element)
				} as TypeElement<GenericFamily>
				return acc
			},
			{} as TypeElementByIds<GenericFamily>
		) || {}
	)
}
