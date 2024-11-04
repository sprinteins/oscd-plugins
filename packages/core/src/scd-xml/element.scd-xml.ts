/**
 * This is an customize version of the createElement function from the core package.
 * https://github.com/openscd/open-scd/blob/main/packages/xml/src/foundation.ts
 *
 * @param xmlDocument - XML Document where the Element should be created
 * @param namespace - Namespace of the element
 * @param tag - Tagname of the element
 * @param attributes - to be added to the created element
 *
 * @returns a new [[`tag`]] element owned by [[`xmlDocument`]].
 */
export function createElementWithNS({
	xmlDocument,
	namespace,
	tag,
	attributes
}: {
	xmlDocument: XMLDocument
	namespace?: string
	tag: string
	attributes?: Record<string, string | null>
}): Element {
	let currentElement: Element
	const currentNamespace =
		namespace || xmlDocument.documentElement.namespaceURI

	currentElement = xmlDocument.createElementNS(currentNamespace, tag)

	if (attributes)
		currentElement = setElementsAttributes(currentElement, attributes)

	return currentElement
}

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
