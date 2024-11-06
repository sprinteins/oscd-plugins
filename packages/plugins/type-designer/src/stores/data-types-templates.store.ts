import { writable, get } from 'svelte/store'
// CORE
import { DataTypeTemplatesService, SCD_ELEMENTS } from '@oscd-plugins/core'
// STORES
import { pluginStore } from './plugin.store'
// TYPES
import type { PrivateElement, DataTypeTemplates } from '@oscd-plugins/core'

//==== INITIALIZER

const typeElementsInitializer: DataTypeTemplates.TypeElements = {
	substationTypes: [],
	voltageLevelTypes: [],
	bayTypes: [],
	iedTypes: [],
	lDeviceTypes: [],
	lNodeTypes: []
}

//==== STATE
const dataTypeTemplateService = writable<DataTypeTemplatesService>()
const rootElement = writable<DataTypeTemplates.RootElement | null>(null)
const privateElement = writable<PrivateElement | null>(null)
const typeElements = writable<DataTypeTemplates.TypeElements>(
	typeElementsInitializer
)
const isStructureCreated = writable(false)

//==== PRIVATE ACTIONS

function setDataTypesTemplateService(newXmlDocument: XMLDocument) {
	dataTypeTemplateService.set(
		new DataTypeTemplatesService(newXmlDocument.documentElement)
	)
}

function setRootElement() {
	const newRootElement = get(dataTypeTemplateService).findDataTypesElement()
	rootElement.set(newRootElement)
}

function setPrivateElement() {
	const currentRootElement = get(rootElement)
	if (!currentRootElement) return privateElement.set(null)

	const newPrivateElement = get(dataTypeTemplateService).findPrivateElement(
		'[type="type-designer-plugin"]',
		{
			root: currentRootElement.element
		}
	)

	privateElement.set(newPrivateElement)
}

function setTypeElements() {
	const currentPrivateElement = get(privateElement)

	const newSubElements = get(dataTypeTemplateService).findTypeElements({
		root: currentPrivateElement?.element
	})

	typeElements.set(newSubElements)
}

function createDataTypeTemplateElement() {
	const currentXmlDocumentElement = get(
		pluginStore.xmlDocument
	)?.documentElement
	if (!currentXmlDocumentElement)
		return console.error('No XML document found')

	const newDataTypeTemplatesElement = pluginStore.addElementToXmlDocument({
		parentElement: currentXmlDocumentElement,
		newElementTagName: 'DataTypeTemplates'
	})
	rootElement.set({
		element: newDataTypeTemplatesElement
	})
}

function createPrivateElement() {
	const currentRootElement = get(rootElement)?.element
	if (!currentRootElement)
		return console.error('No Root DataTypeTemplates element found')

	const newPrivateElement = pluginStore.addElementToXmlDocument({
		parentElement: currentRootElement,
		newElementTagName: 'Private',
		elementAttributes: {
			type: 'type-designer-plugin'
		}
	})

	privateElement.set({
		element: newPrivateElement,
		type: 'type-designer-plugin'
	})
}

function createPluginXmlStructure() {
	if (get(isStructureCreated)) return

	if (!get(rootElement)) createDataTypeTemplateElement()
	if (!get(privateElement)) createPrivateElement()

	isStructureCreated.set(true)
}

//==== PUBLIC ACTIONS

function addNewType(columnKey: keyof typeof SCD_ELEMENTS) {
	createPluginXmlStructure()

	const currentPrivateElement = get(privateElement)?.element
	if (!currentPrivateElement)
		return console.error('No Private element found in DataTypeTemplates')

	const iterateType = get(typeElements)[`${columnKey}Types`].length + 1

	const newElementId = `${SCD_ELEMENTS[columnKey].type.baseId}${iterateType}`
	const newElementName = `${SCD_ELEMENTS[columnKey].type.baseName}${iterateType}`

	const insertElementBefore = SCD_ELEMENTS[columnKey].type.insertBefore
	const firstElementOfNextType = insertElementBefore
		? get(typeElements)[insertElementBefore][0]?.element
		: undefined

	pluginStore.addElementToXmlDocument({
		parentElement: currentPrivateElement,
		newElementTagName: SCD_ELEMENTS[columnKey].type.tag,
		namespace: 'td',
		elementAttributes: {
			id: newElementId,
			name: newElementName
		},
		insertBefore: firstElementOfNextType
	})
}

function addNewTypeRef({
	columnKey,
	typeElement,
	refElement,
	insertBeforeTypeRefElement
}: {
	columnKey: keyof typeof SCD_ELEMENTS
	typeElement: Element
	refElement: Element
	insertBeforeTypeRefElement?: Element
}) {
	pluginStore.addElementToXmlDocument({
		parentElement: typeElement,
		newElementTagName: SCD_ELEMENTS[columnKey].typeRef.tag,
		namespace: 'td',
		elementAttributes: {
			type: refElement.getAttribute('id')
		},
		insertBefore: insertBeforeTypeRefElement
	})
}

function deleteType({
	currentType
}: {
	currentType: DataTypeTemplates.TypeElement
}) {
	const currentPrivateElement = get(privateElement)?.element
	if (!currentPrivateElement)
		return console.error('No Private element found in DataTypeTemplates')

	const elementToDelete = currentType.element
	if (elementToDelete)
		pluginStore.createAndDispatchRemoveActionEvent({
			parent: currentPrivateElement,
			element: elementToDelete
		})
}

function deleteTypeRef({
	currentType,
	currentElementId
}: {
	currentType: DataTypeTemplates.TypeElement
	currentElementId: string
}) {
	const currentTypeRef = currentType.typeRefs?.find(
		(typeRef) => typeRef.type === currentElementId
	)
	if (currentTypeRef)
		pluginStore.createAndDispatchRemoveActionEvent({
			parent: currentType.element,
			element: currentTypeRef.element
		})
}

//==== STORE INITIALIZATION

function init(newXmlDocument: XMLDocument | undefined) {
	if (!newXmlDocument) return

	setDataTypesTemplateService(newXmlDocument)

	setRootElement()
	setPrivateElement()
	setTypeElements()

	isStructureCreated.set(false)
}

//==== PUBLIC STORE
export const dataTypeTemplatesStore = {
	//state
	dataTypeTemplatesRootElement: rootElement,
	dataTypeTemplatesSubElements: typeElements,
	//actions
	init,
	addNewType,
	deleteType,
	addNewTypeRef,
	deleteTypeRef
}
