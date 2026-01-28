function createServerElementWithAuth(doc: XMLDocument): Element {
  const serverElement = doc.createElement('Server')
	const authElement = doc.createElement('Authentication')
	authElement.setAttribute('none', 'true')
	serverElement.appendChild(authElement)
  return serverElement;
}

function getExistingServer(accessPoint: Element): Element | undefined {
  return Array.from(accessPoint.children).find(
		(child) => child.localName === 'Server'
	)
}

export function getOrCreateServerElement(doc: XMLDocument, accessPoint: Element): Element {
  const existingServer = getExistingServer(accessPoint);
  if (existingServer) {
    return existingServer;
  }

  const serverElement = createServerElementWithAuth(doc);
  accessPoint.appendChild(serverElement);
  return serverElement;
}