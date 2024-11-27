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

function onCreate(action: Create) {
	action.new.parent.insertBefore(
		action.new.element,
		action.new.reference ?? null
	)
}

function onDelete(action: Delete) {
	if (!action.old.reference)
		action.old.reference = action.old.element.nextSibling
	if (action.old.element.parentNode !== action.old.parent) return

	action.old.parent.removeChild(action.old.element)
}

function onReplace(action: Replace) {
	console.warn('TODO onReplace', action)
}

function onUpdate(action: Update) {
	for (const attribute of action.element.attributes) {
		action.element.removeAttributeNode(attribute)
	}
	for (const [key, value] of Object.entries(action.newAttributes)) {
		action.element.setAttribute(key, value ?? '')
	}
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

	if (isMove(action)) onMove(action as Move)
	if (isCreate(action)) onCreate(action as Create)
	if (isDelete(action)) onDelete(action as Delete)
	if (isReplace(action)) onReplace(action as Replace)
	if (isUpdate(action)) onUpdate(action as Update)

	pluginElement.editCount++
}
