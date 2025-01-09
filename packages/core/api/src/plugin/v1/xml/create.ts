import { DEFINITION_PER_VERSION } from '@/plugin/v1/constants'
// TYPES
import type { Xml } from './types'
import type { Utils } from '@/plugin/v1/utils'
import type { StandardVersion } from '@oscd-plugins/core-standard/ed2'

//====== PRIVATE FUNCTIONS ======//

function setElementsAttributes(
	element: Element,
	attributes: Record<string, string | null>
) {
	const filteredAttributes = Object.entries(attributes).filter(
		([_, value]) => value !== null
	) as [string, string][]

	for (const [name, value] of filteredAttributes) {
		element.setAttribute(name, value)
	}
	return element
}

function checkIfRequiredAttributesArePresent(
	attributes: Record<string, string | null> | undefined,
	element: Utils.CurrentDefinitionElements,
	standardVersion: StandardVersion = 'ed2'
) {
	const CURRENT_DEFINITION = DEFINITION_PER_VERSION[standardVersion]
	const elementAttributes = Object.keys(
		CURRENT_DEFINITION[element].attributes
	)

	if (!elementAttributes.length) return

	const areRequiredAttributesMissing = elementAttributes.every((key) => {
		if (
			CURRENT_DEFINITION[element].attributes[
				key as keyof (typeof CURRENT_DEFINITION)[typeof element]['attributes']
				// biome-ignore lint/complexity/useLiteralKeys: type can't be inferred here
			]['required']
		) {
			if (!attributes || !attributes[key]) return true
			return false
		}
		return false
	})

	if (areRequiredAttributesMissing)
		throw new Error(`Missing required attributes for ${element}`)
}

function checkIfAttributesAreAllowed(
	attributes: Record<string, string | null> | undefined,
	element: Utils.CurrentDefinitionElements,
	standardVersion: StandardVersion = 'ed2'
) {
	const CURRENT_DEFINITION = DEFINITION_PER_VERSION[standardVersion]

	if (!attributes || CURRENT_DEFINITION[element].anyAllowed.attributes) return

	const elementAttributes = Object.keys(
		CURRENT_DEFINITION[element].attributes
	)

	for (const key in attributes) {
		if (!elementAttributes.includes(key))
			throw new Error(`Attribute ${key} is not allowed for ${element}`)
	}
}

//====== PUBLIC FUNCTIONS ======//

/**
 * @since 0.0.1
 *
 * This is an customize version of the createElement function from the legacy openscd core package.
 * https://github.com/openscd/open-scd/blob/main/packages/xml/src/foundation.ts
 *
 * @param xmlDocument - XML Document where the Element should be created
 * @param namespace - Optional namespace of the element
 * @param tag - Tagname of the element
 * @param attributes - to be added to the created element
 *
 * @returns a new [[`tag`]] element owned by [[`xmlDocument`]].
 */
export async function createStandardElement({
	xmlDocument,
	namespace,
	element,
	attributes = {},
	standardVersion = 'ed2'
}: {
	xmlDocument: XMLDocument
	namespace?: string
	element: Utils.CurrentDefinitionElements
	attributes?: Record<string, string | null> | Record<never, never>
	standardVersion?: StandardVersion
}) {
	const CURRENT_DEFINITION = DEFINITION_PER_VERSION[standardVersion]

	let currentElement: Element

	if (element === 'private') {
		const currentNamespace =
			namespace || xmlDocument.documentElement.namespaceURI
		currentElement = xmlDocument.createElementNS(
			currentNamespace,
			CURRENT_DEFINITION[element].tag
		)
	} else
		currentElement = xmlDocument.createElement(
			CURRENT_DEFINITION[element].tag
		)

	if (Object.keys(attributes).length) {
		checkIfRequiredAttributesArePresent(
			attributes,
			element,
			standardVersion
		)
		checkIfAttributesAreAllowed(attributes, element, standardVersion)

		currentElement = setElementsAttributes(currentElement, attributes)
	}

	return currentElement as Xml.SclElement<typeof element>
}
