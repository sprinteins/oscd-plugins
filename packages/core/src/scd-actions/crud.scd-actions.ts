import { createElementWithNS } from '@/scd-xml/element.scd-xml'
// EVENTS API
import {
	createEvent,
	updateEvent
} from '@/scd-events/createAndDispatchEvent.scd-events'
// UTILS
import { mapNamedNodeMapToObject } from '@/utils/mappers'

export function addElementToXmlDocument<AllowedTags>({
	host,
	currentXmlDocument,
	parentElement,
	namespace,
	newElementTagName,
	elementAttributes,
	insertBefore
}: {
	host: Element
	currentXmlDocument: XMLDocument
	parentElement: Element
	namespace?: string
	newElementTagName: AllowedTags
	elementAttributes?: Record<string, string | null>
	insertBefore?: Element
}) {
	const payload = {
		xmlDocument: currentXmlDocument,
		tag: newElementTagName as string,
		...(elementAttributes && { attributes: elementAttributes }),
		...(namespace && { namespace })
	}

	const newElement = createElementWithNS(payload)

	createEvent({
		host,
		parent: parentElement,
		element: newElement,
		reference: insertBefore
	})

	return newElement
}

export function updateElementFromXmlDocument({
	host,
	element,
	newAttributes
}: {
	host: Element
	element: Element
	newAttributes: Record<string, string | null>
}) {
	const oldAttributes = mapNamedNodeMapToObject(element.attributes)

	return updateEvent({
		host,
		element,
		oldAttributes,
		newAttributes
	})
}
