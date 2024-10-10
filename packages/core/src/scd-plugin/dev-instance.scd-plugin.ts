// UTILS
import { serializeXmlDocument } from '../scd-xml'
// TYPES
import type { PluginInstance } from './instance.scd-plugin'

export function devPluginInstance(pluginClass: CustomElementConstructor) {
	customElements.define('type-designer-plugin', pluginClass)

	// Create an instance of the custom element and add it to the DOM
	const pluginElement = document.createElement(
		'type-designer-plugin'
	) as PluginInstance
	document.body.appendChild(pluginElement)

	// Document events to simulate the OPENSCD instance actions
	document.addEventListener('open-doc', handleOpenDoc as EventListener)
	document.addEventListener('save-doc', handleSaveDoc as EventListener)
	document.addEventListener('editor-action', handleCreateDoc as EventListener)

	function handleOpenDoc(event: CustomEvent) {
		pluginElement.doc = event.detail.doc
		pluginElement.docName = event.detail.docName
	}

	function handleSaveDoc() {
		const xmlString = serializeXmlDocument(pluginElement.doc)

		const blob = new Blob([xmlString], { type: 'application/xml' })
		const url = URL.createObjectURL(blob)
		const a = document.createElement('a')
		a.href = url
		a.download = pluginElement.docName
		document.body.appendChild(a)
		a.click()
		document.body.removeChild(a)
		URL.revokeObjectURL(url)
	}

	function handleCreateDoc(event: CustomEvent) {
		const { action } = event.detail
		action.new.parent.insertBefore(
			action.new.element,
			action.new.reference ?? null
		)
	}
}
