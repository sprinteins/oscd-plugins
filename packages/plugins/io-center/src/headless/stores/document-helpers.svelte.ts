import { createAndDispatchEditEvent } from "@oscd-plugins/core-api/plugin/v1"


export function createElement(host: Element, doc: XMLDocument, tagName: string, attributes: Record<string, string | null>, parent: Element, reference: Element | null) {
	const newElement = doc.createElement(tagName)

	const filteredAttributes = Object.entries(attributes).filter(
		([_, value]) => value !== null
	) as [string, string][]

	for (const [name, value] of filteredAttributes) {
		newElement.setAttribute(name, value)
	}
	createAndDispatchEditEvent({
		host,
		edit: {
			node: newElement,
			parent: parent,
			reference: reference,
		}
	})
}
