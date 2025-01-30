// HELPERS
import { getCurrentElementDefinition } from '@/plugin/v1/utils'
// TYPES
import type { CheckAttributes, Attributes, Namespace } from './types.create'
import type { IEC61850 } from '@oscd-plugins/core-standard'

export function setElementsAttributes({
	element,
	setAttributesToFirstChild,
	attributes,
	namespace
}: {
	element: Element
	setAttributesToFirstChild?: boolean
	attributes: Attributes
	namespace?: Namespace
}) {
	const filteredAttributes = Object.entries(attributes).filter(
		([_, value]) => value !== null
	) as [string, string][]

	for (const [name, value] of filteredAttributes) {
		if (namespace)
			(setAttributesToFirstChild
				? element.firstElementChild || element
				: element
			).setAttributeNS(
				namespace.uri,
				`${namespace.prefix}:${name}`,
				value
			)
		else
			(setAttributesToFirstChild
				? element.firstElementChild || element
				: element
			).setAttribute(name, value)
	}
	return element
}

export function checkIfRequiredAttributesArePresent<
	GenericElement extends IEC61850.AvailableElement<
		GenericEdition,
		GenericUnstableRevision
	>,
	GenericEdition extends IEC61850.AvailableEdition,
	GenericUnstableRevision extends
		| IEC61850.AvailableUnstableRevision<GenericEdition>
		| undefined = undefined
>({
	currentEdition,
	currentUnstableRevision,
	element,
	attributes
}: CheckAttributes<GenericElement, GenericEdition, GenericUnstableRevision>) {
	// const
	const CURRENT_ELEMENT_DEFINITION = getCurrentElementDefinition<
		GenericElement,
		GenericEdition,
		GenericUnstableRevision
	>({
		currentEdition,
		currentUnstableRevision,
		element: element.family
	})

	const currentElementDefinitionEntries = Object.entries(
		CURRENT_ELEMENT_DEFINITION.attributes
	)

	const areRequiredAttributesMissing = currentElementDefinitionEntries.every(
		([attributeKey, currentAttribute]) => {
			if (currentAttribute.required) {
				if (!attributes || !attributes[attributeKey]) return true
				return false
			}
			return false
		}
	)

	if (areRequiredAttributesMissing)
		throw new Error(
			`Missing required attributes for ${element.family as string}`
		)
}

export function checkIfAttributesAreAllowed<
	GenericElement extends IEC61850.AvailableElement<
		GenericEdition,
		GenericUnstableRevision
	>,
	GenericEdition extends IEC61850.AvailableEdition,
	GenericUnstableRevision extends
		| IEC61850.AvailableUnstableRevision<GenericEdition>
		| undefined = undefined
>({
	currentEdition,
	currentUnstableRevision,
	element,
	attributes
}: CheckAttributes<GenericElement, GenericEdition, GenericUnstableRevision>) {
	const CURRENT_ELEMENT_DEFINITION = getCurrentElementDefinition({
		currentEdition,
		currentUnstableRevision,
		element: element.family
	})

	if (!attributes || CURRENT_ELEMENT_DEFINITION.anyAllowed.attributes) return

	const currentElementAttributesKeys = Object.keys(
		CURRENT_ELEMENT_DEFINITION.attributes
	)

	for (const key in attributes) {
		if (!currentElementAttributesKeys.includes(key)) {
			throw new Error(
				`Attribute ${key} is not allowed for ${element.family as string}`
			)
		}
	}
}
