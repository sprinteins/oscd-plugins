import { writable, get } from 'svelte/store'
// CORE
import { DataTypeTemplatesService } from '@oscd-plugins/core'
// TYPES
import type { DataTypeTemplates } from '@oscd-plugins/core'

//==== STATE
const rootElement = writable<DataTypeTemplates.RootElement | null>(null)
const subElements = writable<DataTypeTemplates.SubElements>()

//==== PRIVATE ACTIONS

function setRootElement(service: DataTypeTemplatesService) {
	const newRootElement = service.findDataTypesElement()

	rootElement.set(newRootElement)
}

function setSubElements(
	service: DataTypeTemplatesService
): DataTypeTemplates.SubElements {
	const newSubElements = service.findTypeDesignerElements({
		root: get(rootElement)?.element
	})

	subElements.set(newSubElements)
	return newSubElements
}

//==== INITIALIZATION
function init(newXmlDocument: Element | undefined) {
	if (!newXmlDocument) return
	const service = new DataTypeTemplatesService(newXmlDocument)
	setRootElement(service)
	setSubElements(service)
}

export const dataTypeTemplatesStore = {
	//state
	dataTypeTemplatesRootElement: rootElement,
	dataTypeTemplatesSubElements: subElements,
	//actions
	init
}
