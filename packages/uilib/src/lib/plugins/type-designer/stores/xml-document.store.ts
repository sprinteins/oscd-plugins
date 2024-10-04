// SVELTE
import { writable, get } from 'svelte/store'
// OPENSCD
import { createElement, newActionEvent } from '@oscd-plugins/core'
// STORES
import { dataTypeTemplatesStore } from './index'
// TYPES
import type { DataTypeTemplates } from '@oscd-plugins/core'

// STATE
const xmlDocument = writable<XMLDocument>()

// ACTIONS
function init(newXMLDocument: XMLDocument) {
	xmlDocument.set(newXMLDocument)
}

function addElementToXmlDocument(
	newElementTagName: DataTypeTemplates.AllowedTag,
	elementAttributes: Record<string, string | null>,
	pluginHtmlContext: HTMLElement
) {
	const { dataTypeTemplatesRootElement } = dataTypeTemplatesStore

	const newElement = createElement(
		get(xmlDocument),
		newElementTagName,
		elementAttributes
	)
	const event = newActionEvent({
		new: {
			parent: get(dataTypeTemplatesRootElement).element,
			element: newElement
		}
	})

	pluginHtmlContext.dispatchEvent(event)
}

export const xmlDocumentStore = {
	//state
	xmlDocument,
	//actions
	init,
	addElementToXmlDocument
}
