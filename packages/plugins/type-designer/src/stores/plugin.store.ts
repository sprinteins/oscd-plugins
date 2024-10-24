// SVELTE
import { writable, get } from 'svelte/store'
// CORE
import { createElementWithNS, newActionEvent } from '@oscd-plugins/core'
// TYPES
import type { DataTypeTemplates } from '@oscd-plugins/core'

//====== STATE ======//
const xmlDocument = writable<XMLDocument | undefined>(undefined)
const pluginHostElement = writable<Element>()

//====== ACTIONS ======//

function createAndDispatchActionEvent(
	parent: Element,
	element: Element,
	reference: Element | undefined = undefined
) {
	const event = newActionEvent({
		new: {
			parent,
			element,
			reference
		}
	})

	get(pluginHostElement).dispatchEvent(event)
}

function addElementToXmlDocument({
	parentElement,
	namespace,
	newElementTagName,
	elementAttributes,
	insertBefore
}: {
	parentElement: Element
	namespace?: string
	newElementTagName: DataTypeTemplates.AllowedTags
	elementAttributes?: Record<string, string | null>
	insertBefore?: Element
}) {
	const currentXmlDocument = get(xmlDocument)
	if (!currentXmlDocument) throw new Error('Xml document is not set')

	const payload = {
		xmlDocument: currentXmlDocument,
		tag: newElementTagName,
		...(elementAttributes && { attributes: elementAttributes }),
		...(namespace && { namespace })
	}

	const newElement = createElementWithNS(payload)

	createAndDispatchActionEvent(parentElement, newElement, insertBefore)

	return newElement
}

//====== INITIALIZATION ======//

async function init({
	newXmlDocument,
	newPluginHostElement
}: {
	newXmlDocument: XMLDocument | undefined
	newPluginHostElement: Element
}) {
	xmlDocument.set(newXmlDocument)
	pluginHostElement.set(newPluginHostElement)
}

export const pluginStore = {
	//state
	xmlDocument,
	pluginHostElement,
	//actions
	addElementToXmlDocument,
	init
}
