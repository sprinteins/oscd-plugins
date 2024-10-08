import { writable, get } from 'svelte/store'
// CORE
import { DataTypeTemplatesService } from '@oscd-plugins/core'
// TYPES
import type { DataTypeTemplates } from '@oscd-plugins/core'

//==== STATE
const rootElement = writable<DataTypeTemplates.RootElement | null>(null)
const subElements = writable<DataTypeTemplates.SubElements>()

//==== PRIVATE ACTIONS

function setRootElement(newXmlDocument: Element) {
	const typeDesigner = new DataTypeTemplatesService(newXmlDocument)
	const newRootElement = typeDesigner.findDataTypesElement()

	rootElement.set(newRootElement)
}

function setSubElements(newXmlDocument: Element) {
	const typeDesigner = new DataTypeTemplatesService(newXmlDocument)

	const newSubElements = typeDesigner.findTypeDesignerElements({
		root: get(rootElement)?.element
	})

	subElements.set(newSubElements)
}

//==== INITIALIZATION
function init(newXmlDocument: Element) {
	setRootElement(newXmlDocument)
	setSubElements(newXmlDocument)
}

export const dataTypeTemplatesStore = {
	//state
	dataTypeTemplatesRootElement: rootElement,
	dataTypeTemplatesSubElements: subElements,
	//actions
	init
}
