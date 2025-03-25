import { IEC61850_DEFINITIONS } from '@oscd-plugins/core-standard'
// TYPES
import type { IEC61850 } from '@oscd-plugins/core-standard'

export function getCurrentDefinition<
	GenericEdition extends IEC61850.AvailableEdition,
	GenericUnstableRevision extends
		| IEC61850.AvailableUnstableRevision<GenericEdition>
		| undefined = undefined
>({
	currentEdition,
	currentUnstableRevision
}: {
	currentEdition: GenericEdition
	currentUnstableRevision?: GenericUnstableRevision
}): IEC61850.CurrentDefinition<GenericEdition, GenericUnstableRevision> {
	return currentUnstableRevision
		? (IEC61850_DEFINITIONS[currentEdition].unstable[
				currentUnstableRevision
			] as IEC61850.CurrentDefinition<
				GenericEdition,
				GenericUnstableRevision
			>)
		: (IEC61850_DEFINITIONS[currentEdition]
				.stable as IEC61850.CurrentDefinition<
				GenericEdition,
				GenericUnstableRevision
			>)
}

export function getCurrentElementDefinition<
	GenericElement extends IEC61850.AvailableElement<
		GenericEdition,
		GenericUnstableRevision
	>,
	GenericEdition extends IEC61850.AvailableEdition,
	GenericUnstableRevision extends
		| IEC61850.AvailableUnstableRevision<GenericEdition>
		| undefined = undefined
>({
	element,
	currentEdition,
	currentUnstableRevision
}: {
	element: GenericElement
	currentEdition: GenericEdition
	currentUnstableRevision?: GenericUnstableRevision
}) {
	const CURRENT_DEFINITION = getCurrentDefinition({
		currentEdition,
		currentUnstableRevision
	})

	const CURRENT_DEFINITION_ELEMENT = CURRENT_DEFINITION[
		element
	] as IEC61850.GeneratedElement<
		GenericElement,
		GenericEdition,
		GenericUnstableRevision
	>

	return {
		tag: CURRENT_DEFINITION_ELEMENT.tag,
		anyAllowed: CURRENT_DEFINITION_ELEMENT.anyAllowed,
		attributes: CURRENT_DEFINITION_ELEMENT.attributes,
		subElements: CURRENT_DEFINITION_ELEMENT.subElements
	}
}

export function getAttributes(element: Element) {
	const attributes = Array.from(element.attributes)
	const attributesObject: Record<string, string> = {}

	for (const attribute of attributes)
		attributesObject[attribute.name] = attribute.value

	return attributesObject
}

export function getAttributesNS(element: Element) {
	const attributes = Array.from(element.attributes)
	const attributesObject: Record<string, Record<string, string | null>> = {}

	for (const attribute of attributes) {
		if (attribute.namespaceURI) {
			if (!attributesObject[attribute.namespaceURI]) {
				attributesObject[attribute.namespaceURI] = {}
			}
			attributesObject[attribute.namespaceURI][attribute.localName] =
				attribute.value
		}
	}

	return attributesObject
}

/**
 * Deep nested comparison of two elements
 * tagName, attributes and children are compared
 * @param firstElement
 * @param secondElement
 * @returns
 */
export function areElementsIdentical(
	firstElement: Element,
	secondElement: Element
) {
	// Compare tag names
	if (firstElement.tagName !== secondElement.tagName) return false

	// Compare attributes
	const firstElementAttributes = firstElement.attributes
	const secondElementAttributes = secondElement.attributes

	if (firstElementAttributes.length !== secondElementAttributes.length)
		return false

	for (let i = 0; i < firstElementAttributes.length; i++) {
		const currentAttributeFromFirstElement = firstElementAttributes[i]

		const currentAttributeFromSecondElement =
			secondElementAttributes.getNamedItem(
				currentAttributeFromFirstElement.name
			)

		if (
			!currentAttributeFromSecondElement ||
			currentAttributeFromFirstElement.value !==
				currentAttributeFromSecondElement.value
		)
			return false
	}

	// Compare child elements
	const firstElementChildren = firstElement.children
	const secondElementChildren = secondElement.children

	if (firstElementChildren.length !== secondElementChildren.length)
		return false

	for (let i = 0; i < firstElementChildren.length; i++) {
		if (
			!areElementsIdentical(
				firstElementChildren[i],
				secondElementChildren[i]
			)
		)
			return false
	}

	return true
}
