// UTILS
import { serializeXmlDocument } from '../scd-xml'
// OPENSCD
import {
	isMove,
	isCreate,
	isDelete,
	isReplace,
	isUpdate
} from '../scd-events-v1'
// TYPES
import type {
	PluginConstructor,
	EditorPluginInstance,
	PluginType
} from './types.scd-plugin'
import type { Create, Delete, Move, Replace, Update } from '../scd-events-v1'

export default function standAloneMode(
	pluginInstance: PluginConstructor,
	pluginType: PluginType
) {
	customElements.define('stand-alone-plugin', pluginInstance)

	// Create an instance of the custom element and add it to the DOM
	//====== INITIALIZATION ======//

	const pluginElement = document.createElement('stand-alone-plugin')
	document.body.appendChild(pluginElement)

	if (pluginType === 'editor')
		emulateOpenSCDInstanceEditionActions(
			pluginElement as EditorPluginInstance
		)
}

//====== EMULATION ======//

function emulateOpenSCDInstanceEditionActions(
	pluginElement: EditorPluginInstance
) {
	// Document events to simulate the OPENSCD instance actions
	//======= EVENTS ======//

	document.addEventListener('open-doc', handleOpenDoc as EventListener)
	document.addEventListener('save-doc', handleSaveDoc as EventListener)
	// We only handle simple actions for now
	document.addEventListener('editor-action', onSimpleAction as EventListener)

	//====== EVENTS HANDLERS ======//

	function handleOpenDoc(event: CustomEvent) {
		pluginElement.doc = event.detail.doc
		pluginElement.docName = event.detail.docName
	}

	function handleSaveDoc() {
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

	//====== EDIT ACTIONS ======//
	function onSimpleAction(event: CustomEvent) {
		const { action } = event.detail
		if (isMove(action)) return onMove(action as Move)
		if (isCreate(action)) return onCreate(action as Create)
		if (isDelete(action)) return onDelete(action as Delete)
		if (isReplace(action)) return onReplace(action as Replace)
		if (isUpdate(action)) return onUpdate(action as Update)
	}

	function onMove(action: Move) {
		console.warn('TODO onCreate', action)
	}

	function onCreate(action: Create) {
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

	function onUpdate(action: Update) {
		for (const attribute of action.element.attributes) {
			action.element.removeAttributeNode(attribute)
		}
		for (const [key, value] of Object.entries(action.newAttributes)) {
			action.element.setAttribute(key, value ?? '')
		}
		pluginElement.editCount++
	}
}
