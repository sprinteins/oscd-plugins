/**
 * This utility function queries the shadow dom
 * in order to retrieve the nested element with the given class name
 * It can be used without parameters to query the default editor element
 */
export function getElementInsideNestedShadowDom(
	{ rootSelector, rootSelectorPosition, className } = {
		rootSelector: 'open-scd',
		rootSelectorPosition: 0,
		className: 'editor'
	}
) {
	const documentElements = document.querySelectorAll(rootSelector)
	if (documentElements.length <= rootSelectorPosition) return null

	const rootElement = documentElements[rootSelectorPosition]
	if (!rootElement) return null

	function findInShadowDom(rootElement: Element): null | Element {
		if (!rootElement) return null
		const shadowRoot = rootElement.shadowRoot
		if (!shadowRoot) return null

		const nestedElement = shadowRoot.querySelector(`.${className}`)
		if (nestedElement) return nestedElement

		const nestedElements = shadowRoot.querySelectorAll('*')
		for (let i = 0; i < nestedElements.length; i++) {
			const found = findInShadowDom(nestedElements[i])
			if (found) return found
		}
		return null
	}

	return findInShadowDom(rootElement)
}
