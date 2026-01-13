export function createAccessPoints(
	iedElement: Element,
	accessPoints: { name: string; description?: string }[]
): Element {
	const doc = iedElement.ownerDocument
	if (!doc) return iedElement

	for (const ap of accessPoints) {
		const apElement = doc.createElement('AccessPoint')
		apElement.setAttribute('name', ap.name)
		if (ap.description !== undefined)
			apElement.setAttribute('desc', ap.description)

		const serverElement = doc.createElement('Server')
		const authElement = doc.createElement('Authentication')
		authElement.setAttribute('none', 'true')

		serverElement.appendChild(authElement)
		apElement.appendChild(serverElement)
		iedElement.appendChild(apElement)
	}

	return iedElement
}
