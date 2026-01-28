export function createServerElementWithAuth(doc: XMLDocument): Element {
  const serverElement = doc.createElement('Server')
	const authElement = doc.createElement('Authentication')
	authElement.setAttribute('none', 'true')
	serverElement.appendChild(authElement)
  return serverElement;
}

export function getExistingServer(accessPoint: Element): Element | undefined {
  return Array.from(accessPoint.children).find(
		(child) => child.localName === 'Server'
	)
}