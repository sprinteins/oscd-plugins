// CORE
import {
	findAllCustomElementBySelector,
	findAllStandardElementsByTagNameNS,
	namedNodeMapAttributesToPlainObject,
	typeGuard
} from '@oscd-plugins/core-api/plugin/v1'
import { v4 as uuidv4 } from 'uuid'
// CONSTANTS
import {
	REF_FAMILY,
	REF_FAMILY_TO_TYPE_FAMILY_MAP,
	TYPE_FAMILY,
	TYPE_ID_ATTRIBUTE
} from '@/headless/constants'
// TYPES
import type {
	AvailableRefFamily,
	AvailableTypeFamily,
	RefElementsByFamily,
	RefRawElement,
	TypeElement,
	TypeElementByIds,
	TypeRawElement
} from '@/headless/stores'
// STORES
import { pluginLocalStore, typeElementsStore } from '@/headless/stores'
// HELPERS
import { getChildrenOptions } from '@/headless/stores/type-elements/children-options.helper'

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

function getMissingRequiredAttributes(
	family: AvailableTypeFamily,
	element: Element
) {
	const definition = pluginLocalStore.currentDefinition[TYPE_FAMILY[family]]
	const requiredAttributes = new Set([
		...Object.entries(definition.attributes)
			.filter(([, attribute]) => attribute.required)
			.map(([attributeName]) => attributeName),
		TYPE_ID_ATTRIBUTE[family]
	])

	return Array.from(requiredAttributes).filter(
		(attributeName) => !element.getAttribute(attributeName)?.trim()
	)
}

function getEmptyRefs(): RefElementsByFamily {
	return {
		generalEquipment: {},
		conductingEquipment: {},
		function: {},
		eqFunction: {},
		lNode: {}
	}
}

function getRefs(element: Element, rootElement?: Element): RefElementsByFamily {
	return Array.from(element.children).reduce((acc, childElement) => {
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
		const templateUuidAttribute = childElement.getAttribute('templateUuid')

		if (lnTypeAttribute) typeId = lnTypeAttribute
		else if (templateUuidAttribute) typeId = templateUuidAttribute

		if (!typeId) throw new Error('No id found for ref element')

		const typeFamily = REF_FAMILY_TO_TYPE_FAMILY_MAP[refFamily]
		if (rootElement) {
			const targetDefinition =
				pluginLocalStore.currentDefinition[TYPE_FAMILY[typeFamily]]
			const targetIdAttribute = TYPE_ID_ATTRIBUTE[typeFamily]
			const targetExists = findAllStandardElementsByTagNameNS<
				typeof typeFamily,
				typeof pluginLocalStore.currentEdition,
				typeof pluginLocalStore.currentUnstableRevision
			>({
				namespace: '*',
				tagName: targetDefinition.tag,
				root: rootElement
			}).some(
				(targetElement) =>
					targetElement.getAttribute(targetIdAttribute) === typeId
			)

			if (!targetExists)
				throw new Error(
					`No ${targetDefinition.tag} found with ${targetIdAttribute} "${typeId}"`
				)
		}

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
	}, getEmptyRefs())
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
	return (params.typeElements || []).reduce(
		(acc, element, index) => {
			const identifierAttribute = TYPE_ID_ATTRIBUTE[params.family]
			const originalId = element.getAttribute(identifierAttribute)
			const fallbackId = `invalid-${params.family}-${index}`
			let elementId = originalId || fallbackId
			let corruptionReason: string | undefined

			if (!originalId)
				corruptionReason = `Missing required SCL attribute "${identifierAttribute}"`

			const missingRequiredAttributes = getMissingRequiredAttributes(
				params.family,
				element
			)
			if (missingRequiredAttributes.length) {
				corruptionReason ??= `Missing or empty required SCL attributes: ${missingRequiredAttributes.join(', ')}`
			}

			if (Object.hasOwn(acc, elementId)) {
				const duplicateId = elementId
				elementId = fallbackId
				while (Object.hasOwn(acc, elementId))
					elementId = `${elementId}-duplicate`

				const duplicateReason = `Duplicate ${identifierAttribute} "${duplicateId}"`
				acc[duplicateId].corruptionReason ??= duplicateReason
				corruptionReason ??= duplicateReason
			}

			try {
				acc[elementId] = {
					element,
					attributes: getTypeElementAttributes({
						family: params.family,
						attributes: element.attributes,
						elementId: originalId || elementId
					}),
					parameters: {
						label:
							element.getAttribute('name') ||
							element.getAttribute('id') ||
							'Invalid SCL element',
						refFamily: getRefFamily(
							params.family,
							originalId || elementId,
							params.rootElement
						),
						childrenOptions: getChildrenOptions({
							family: params.family,
							element
						})
					},
					refs: getRefs(element, params.rootElement),
					...(corruptionReason ? { corruptionReason } : {})
				} as TypeElement<GenericFamily>
			} catch (error) {
				acc[elementId] = {
					element,
					corruptionReason:
						corruptionReason ??
						(error instanceof Error
							? error.message
							: `Unable to read ${element.tagName}`),
					attributes: {
						...Object.fromEntries(
							Array.from(
								element.attributes,
								({ name, value }) => [name, value]
							)
						),
						[identifierAttribute]: originalId || elementId
					},
					parameters: {
						label:
							element.getAttribute('name') ||
							element.getAttribute('id') ||
							'Invalid SCL element',
						refFamily: undefined,
						childrenOptions: {
							bay: undefined,
							generalEquipment: undefined,
							conductingEquipment: undefined,
							function: undefined,
							lNodeType: undefined
						}
					},
					refs: getEmptyRefs()
				} as TypeElement<GenericFamily>
			}

			return acc
		},
		{} as TypeElementByIds<GenericFamily>
	)
}
