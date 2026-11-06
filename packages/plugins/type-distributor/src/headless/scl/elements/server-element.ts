import { createElement } from '@oscd-plugins/core'

export function createServerElementWithAuth(doc: XMLDocument): Element {
	const serverElement = createElement(doc, 'Server', {})
	const authElement = createElement(doc, 'Authentication', { none: 'true' })
	serverElement.appendChild(authElement)
	return serverElement
}

export function queryServer(accessPoint: Element): Element | null {
	return queryServerFromAccessPoint(accessPoint, new Set())
}

function queryServerFromAccessPoint(
	accessPoint: Element,
	visited: Set<Element>
): Element | null {
	if (visited.has(accessPoint)) return null
	visited.add(accessPoint)

	const server = accessPoint.querySelector('Server')
	if (server) return server

	const apName = Array.from(accessPoint.children)
		.find((child) => child.localName === 'ServerAt')
		?.getAttribute('apName')
	const ied = accessPoint.parentElement
	if (!apName || !ied) return null

	const serverAccessPoint = Array.from(ied.children).find(
		(child) =>
			child.localName === 'AccessPoint' &&
			child.getAttribute('name') === apName
	)
	return serverAccessPoint
		? queryServerFromAccessPoint(serverAccessPoint, visited)
		: null
}

export function queryServerAtAccessPointsFromHost(
	hostAccessPoint: Element
): Element[] {
	const iedElement = hostAccessPoint.parentElement
	const hostName = hostAccessPoint.getAttribute('name')
	if (!iedElement || hostName === null) return []

	return Array.from(iedElement.children).filter((accessPoint) => {
		if (accessPoint.localName !== 'AccessPoint') return false
		return Array.from(accessPoint.children).some(
			(child) =>
				child.localName === 'ServerAt' &&
				child.getAttribute('apName') === hostName
		)
	})
}
