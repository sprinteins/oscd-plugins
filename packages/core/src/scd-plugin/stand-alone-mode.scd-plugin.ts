// UTILS
import { serializeXmlDocument } from '../scd-xml'
// TYPES
import type {
	PluginConstructor,
	EditorPluginInstance,
	PluginType
} from './types.scd-plugin'

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
	document.addEventListener('editor-action', handleEdition as EventListener)

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

	// for now handling only creation
	// see https://github.com/openscd/open-scd/blob/main/packages/openscd/src/Editing.ts
	function handleEdition(event: CustomEvent) {
		const { action } = event.detail
		action.new.parent.insertBefore(
			action.new.element,
			action.new.reference ?? null
		)
	}
}
