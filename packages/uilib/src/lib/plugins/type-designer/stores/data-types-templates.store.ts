import { writable, get } from 'svelte/store';
// CORE
import { UCTypeDesigner } from '@oscd-plugins/core';
// TYPES
import type { DataTypeTemplates } from '@oscd-plugins/core';

//==== STATE
const rootElement = writable<DataTypeTemplates.RootElement>()
const subElements = writable<DataTypeTemplates.SubElements>()

const treeStructure = writable<DataTypeTemplates.ElementsTreeStructure>()

//==== PRIVATE ACTIONS 
function setTreeStructure(newXmlDocument: Element) {
	const typeDesigner = new UCTypeDesigner(newXmlDocument)
	const newTreeStructure = typeDesigner.getElementTypeTreeStructure()

	treeStructure.set(newTreeStructure)
}

function setRootElement(newXmlDocument: Element) {
	const typeDesigner = new UCTypeDesigner(newXmlDocument)
	const newRootElement = typeDesigner.findDataTypesElement()

	rootElement.set(newRootElement)
}

function setSubElements(newXmlDocument: Element) {
	const typeDesigner = new UCTypeDesigner(newXmlDocument)
	const newSubElements = typeDesigner.findTypeDesignerElements({ root: get(rootElement).element })

	subElements.set(newSubElements)
}

//==== INITIALIZATION
function init(newXmlDocument: Element) {
	setRootElement(newXmlDocument)
	setSubElements(newXmlDocument)
	setTreeStructure(newXmlDocument)
}


export const dataTypeTemplatesStore = {
	//state
	dataTypeTemplatesRootElement: rootElement,
	dataTypeTemplatesSubElements: subElements,
	dataTypeTemplatesTreeStructure: treeStructure,
	//actions
	init
}