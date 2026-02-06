import { createElement } from '@oscd-plugins/core'

export function createServerElementWithAuth(doc: XMLDocument): Element {
	const serverElement = createElement(doc, 'Server', {})
	const authElement = createElement(doc, 'Authentication', { none: 'true' })
	serverElement.appendChild(authElement)
	return serverElement
}

export function queryServer(accessPoint: Element): Element | undefined {
	return (accessPoint.querySelector('Server') as Element) || undefined
}
