const DEFAULT_SIED_ATTRIBUTES = {
	configVersion: '1.0',
	engRight: 'full',
	manufacturer: 'none',
	originalSclRevision: 'B',
	originalSclVersion: '2007',
	type: 'none'
} as const

export function createBasicIEDElement(
	name: string,
	xmlDocument: XMLDocument,
	description?: string
): Element {
	const iedElement = xmlDocument.createElement('IED')

	for (const [key, value] of Object.entries(DEFAULT_SIED_ATTRIBUTES)) {
		iedElement.setAttribute(key, value)
	}

	iedElement.setAttribute('name', name)
	if (description) {
		iedElement.setAttribute('desc', description)
	}

	const servicesElement = xmlDocument.createElement('Services')
	servicesElement.setAttribute('nameLength', '64')
	iedElement.appendChild(servicesElement)

	return iedElement
}
