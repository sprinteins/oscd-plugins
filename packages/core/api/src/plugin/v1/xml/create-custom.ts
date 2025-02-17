import { setElementsAttributes } from './create-helpers'
// CONSTANTS
import { DEFAULT_NAMESPACE_URI } from './constants'
// TYPES
import type { CreateCustomElement } from './types.create'

export function createCustomElement({
	xmlDocument,
	tagName,
	namespace,
	attributes,
	wrapWithPrivateElement,
	setAttributesToFirstChild
}: CreateCustomElement) {
	let customElement: Element

	customElement = xmlDocument.createElementNS(namespace.uri, tagName)

	if (attributes)
		customElement = setElementsAttributes({
			element: customElement,
			attributes,
			setAttributesToFirstChild
		})
	if (wrapWithPrivateElement) {
		const privateElement = xmlDocument.createElementNS(
			DEFAULT_NAMESPACE_URI,
			'Private'
		)
		privateElement.setAttribute('type', namespace.prefix)
		privateElement.appendChild(customElement)

		return privateElement
	}
	return customElement
}
