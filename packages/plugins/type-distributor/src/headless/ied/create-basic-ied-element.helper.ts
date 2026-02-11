import { createElement } from '@oscd-plugins/core'

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
	const iedElement = createElement(xmlDocument, 'IED', {
		...DEFAULT_SIED_ATTRIBUTES,
		name,
		desc: description ?? null
	})

	const servicesElement = createElement(xmlDocument, 'Services', {
		nameLength: '64'
	})
	iedElement.appendChild(servicesElement)

	return iedElement
}
