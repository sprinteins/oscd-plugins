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

	const parent =
		get(dataTypeTemplatesRootElement)?.element ??
		createDataTypeTemplateElement(pluginHtmlContext)

	return createAndDispatchActionEvent(parent, newElement, pluginHtmlContext)
}

function createAndDispatchActionEvent(
	parent: Element,
	element: Element,
	pluginHtmlContext: HTMLElement
) {
	const event = newActionEvent({
		new: {
			parent,
			element
		}
	})

	pluginHtmlContext.dispatchEvent(event)
}

function createDataTypeTemplateElement(
	pluginHtmlContext: HTMLElement
): Element {
	const newDataTypeTemplatesElement = createElement(
		get(xmlDocument),
		'DataTypeTemplates',
		{}
	)
	dataTypeTemplatesStore.dataTypeTemplatesRootElement.set({
		element: newDataTypeTemplatesElement
	})

	createAndDispatchActionEvent(
		get(xmlDocument).documentElement,
		newDataTypeTemplatesElement,
		pluginHtmlContext
	)

	return newDataTypeTemplatesElement
}

export const xmlDocumentStore = {
	//state
	xmlDocument,
	//actions
	init,
	addElementToXmlDocument
}
