import type { Nullable } from "@/types"
import { createAndDispatchEditEvent } from "@oscd-plugins/core-api/plugin/v1"

type Params = {
	host: Element,
	doc: XMLDocument,
	tagName: string,
	attributes?: Record<string, string | null>,
	parent: Element,
	reference: Nullable<Element>,
	innerHTML?: string
}

export function createElement({ host, doc, tagName, attributes, parent, reference = null, innerHTML = "" }: Params) {
	const newElement = doc.createElement(tagName)

	if (innerHTML) {
		newElement.innerHTML = innerHTML
	}

	if (attributes) {
		const filteredAttributes = Object.entries(attributes).filter(
			([_, value]) => value !== null
		) as [string, string][]

		for (const [name, value] of filteredAttributes) {
			newElement.setAttribute(name, value)
		}
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
