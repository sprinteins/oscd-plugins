import { createElement } from '@oscd-plugins/core'

export function createServerElementWithAuth(doc: XMLDocument): Element {
	const serverElement = createElement(doc, 'Server', {})
	const authElement = createElement(doc, 'Authentication', { none: 'true' })
	serverElement.appendChild(authElement)
	return serverElement
}

export function queryOwnServer(accessPoint: Element): Element | null {
	return (
		Array.from(accessPoint.children).find(
			(child) => child.localName === 'Server'
		) ?? null
	)
}

export function queryServerAtElement(accessPoint: Element): Element | null {
	return (
		Array.from(accessPoint.children).find(
			(child) => child.localName === 'ServerAt'
		) ?? null
	)
}

export function resolveServer(accessPoint: Element): Element | null {
	const ownServer = queryOwnServer(accessPoint)
	if (ownServer) return ownServer

	const serverAtApName =
		queryServerAtElement(accessPoint)?.getAttribute('apName')
	const ied = accessPoint.parentElement
	if (!serverAtApName || !ied) return null

	const serverAccessPoint = Array.from(ied.children).find(
		(child) =>
			child.localName === 'AccessPoint' &&
			child.getAttribute('name') === serverAtApName
	)
	return serverAccessPoint ? queryOwnServer(serverAccessPoint) : null
}

export function queryServerAtAccessPointsFromHost(
	hostAccessPoint: Element
): Element[] {
	const iedElement = hostAccessPoint.parentElement
	const hostName = hostAccessPoint.getAttribute('name')
	if (!iedElement || hostName === null) return []

	return Array.from(iedElement.children).filter((accessPoint) => {
		const serverAt = queryServerAtElement(accessPoint)
		return (
			accessPoint.localName === 'AccessPoint' &&
			serverAt?.getAttribute('apName') === hostName
		)
	})
}
