import { createElement } from '@oscd-plugins/core'

export function createServerElementWithAuth(doc: XMLDocument): Element {
	const serverElement = createElement(doc, 'Server', {})
	const authElement = createElement(doc, 'Authentication', { none: 'true' })
	serverElement.appendChild(authElement)
	return serverElement
}

export function queryServer(accessPoint: Element): Element | null {
	const directServer = Array.from(accessPoint.children).find(
		(child) => child.localName === 'Server'
	)
	if (directServer) return directServer

	const serverAtApName = Array.from(accessPoint.children)
		.find((child) => child.localName === 'ServerAt')
		?.getAttribute('apName')
	const ied = accessPoint.parentElement
	if (!serverAtApName || !ied) return null

	const serverAccessPoint = Array.from(ied.children).find(
		(child) =>
			child.localName === 'AccessPoint' &&
			child.getAttribute('name') === serverAtApName
	)
	return (
		Array.from(serverAccessPoint?.children ?? []).find(
			(child) => child.localName === 'Server'
		) ?? null
	)
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
