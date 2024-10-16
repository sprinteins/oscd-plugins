// SVELTE
import { writable, get } from 'svelte/store'
// OPENSCD
import { createElement } from '@oscd-plugins/core'
// STORES
import { pluginStore, eventStore } from './index'
// TYPES
import type { DataTypeTemplates } from '@oscd-plugins/core'

//====== STORES ======//
const { xmlDocument } = pluginStore

//====== STATE ======//

//====== ACTIONS ======//

function addElementToXmlDocument(
	newElementTagName: DataTypeTemplates.AllowedTag,
	elementAttributes: Record<string, string | null>
) {

	const newElement = createElement(
		get(xmlDocument),
		newElementTagName,
		elementAttributes
	)

	const parent =
		createDataTypeTemplateElement()

	return eventStore.createAndDispatchActionEvent(parent, newElement)
}

function createDataTypeTemplateElement(): Element {
	const newDataTypeTemplatesElement = createElement(
		get(xmlDocument),
		'DataTypeTemplates',
		{}
	)

	eventStore.createAndDispatchActionEvent(
		get(xmlDocument).documentElement,
		newDataTypeTemplatesElement
	)

	return newDataTypeTemplatesElement
}

export const xmlDocumentStore = {
	//state
	xmlDocument,
	//actions
	addElementToXmlDocument
}
