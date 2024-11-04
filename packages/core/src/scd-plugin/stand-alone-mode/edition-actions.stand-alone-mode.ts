// OPENSCD
import {
	isMove,
	isCreate,
	isDelete,
	isReplace,
	isUpdate
} from '../../scd-events-v1'
// UTILS
import { serializeXmlDocument } from '../../scd-xml'
// TYPES
import type { EditorPluginInstance } from '../types.scd-plugin'
import type { Create, Delete, Move, Replace, Update } from '../../scd-events-v1'

//====== PRIVATE FUNCTIONS ======//

function onMove(action: Move) {
	console.warn('TODO onCreate', action)
}

function onCreate(pluginElement: EditorPluginInstance, action: Create) {
	action.new.parent.insertBefore(
		action.new.element,
		action.new.reference ?? null
	)
	pluginElement.editCount++
}

function onDelete(action: Delete) {
	console.warn('TODO onDelete', action)
}

function onReplace(action: Replace) {
	console.warn('TODO onReplace', action)
}

function onUpdate(pluginElement: EditorPluginInstance, action: Update) {
	for (const attribute of action.element.attributes) {
		action.element.removeAttributeNode(attribute)
	}
	for (const [key, value] of Object.entries(action.newAttributes)) {
		action.element.setAttribute(key, value ?? '')
	}
	pluginElement.editCount++
}

//====== PUBLIC FUNCTIONS ======//

export function handleOpenDoc(
	pluginElement: EditorPluginInstance,
	event: CustomEvent
) {
	pluginElement.doc = event.detail.doc
	pluginElement.docName = event.detail.docName
}

export function handleSaveDoc(pluginElement: EditorPluginInstance) {
	if (!pluginElement.doc) return
	const xmlString = serializeXmlDocument(pluginElement.doc)

	const blob = new Blob([xmlString], { type: 'application/xml' })
	const url = URL.createObjectURL(blob)
	const a = document.createElement('a')
	a.href = url
	a.download = pluginElement.docName || 'file.xml'
	document.body.appendChild(a)
	a.click()
	document.body.removeChild(a)
	URL.revokeObjectURL(url)
}

export function handleSimpleAction(
	pluginElement: EditorPluginInstance,
	event: CustomEvent
) {
	const { action } = event.detail
	if (isMove(action)) return onMove(action as Move)
	if (isCreate(action)) return onCreate(pluginElement, action as Create)
	if (isDelete(action)) return onDelete(action as Delete)
	if (isReplace(action)) return onReplace(action as Replace)
	if (isUpdate(action)) return onUpdate(pluginElement, action as Update)
}
