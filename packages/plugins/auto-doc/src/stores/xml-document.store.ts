// OPENSCD
import { createElement } from '@oscd-plugins/core'
// TYPES
import type { DataTypeTemplates } from '@oscd-plugins/core'
// SVELTE
import { get, writable } from 'svelte/store'
// STORES
import { dataTypeTemplatesStore, eventStore, pluginStore } from './index'

//====== STORES ======//
const { xmlDocument } = pluginStore

//====== STATE ======//

//====== ACTIONS ======//

function addElementToXmlDocument(
	newElementTagName: DataTypeTemplates.AllowedTag,
	elementAttributes: Record<string, string | null>
) {
	const { dataTypeTemplatesRootElement } = dataTypeTemplatesStore
	const xmlDoc = get(xmlDocument)
	if (!xmlDoc) {
		throw new Error('XML Document is not defined')
	}
	const newElement = createElement(
		xmlDoc,
		newElementTagName,
		elementAttributes
	)

	const parent =
		get(dataTypeTemplatesRootElement)?.element ??
		createDataTypeTemplateElement()

	return eventStore.createAndDispatchActionEvent(parent, newElement)
}

function createDataTypeTemplateElement(): Element {
	const xmlDoc = get(xmlDocument)
	if (!xmlDoc) {
		throw new Error('XML Document is not defined')
	}
	const newDataTypeTemplatesElement = createElement(
		xmlDoc,
		'DataTypeTemplates',
		{}
	)
	dataTypeTemplatesStore.dataTypeTemplatesRootElement.set({
		element: newDataTypeTemplatesElement
	})

	eventStore.createAndDispatchActionEvent(
		xmlDoc.documentElement,
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
