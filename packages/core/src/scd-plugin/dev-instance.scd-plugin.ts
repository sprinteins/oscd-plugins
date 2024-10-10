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
	document.addEventListener('open-doc', handleUpdateDoc as EventListener)
	document.addEventListener('save-doc', handleSaveDoc as EventListener)
	//document.addEventListener('editor-action', handleUpdateDoc as EventListener)

	function handleUpdateDoc(event: CustomEvent) {
		pluginElement.doc = event.detail.doc
		pluginElement.docName = event.detail.docName
	}

	/**
	 * This code comes from the original open-scd project
	 * https://github.com/openscd/open-scd/blob/main/packages/plugins/src/menu/SaveProject.ts
	 */
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

	function serializeXmlDocument(doc: XMLDocument): string {
		const serializer = new XMLSerializer()
		const xmlString = serializer.serializeToString(doc)
		const xmlStringRoot = '<?xml version="1.0" encoding="UTF-8"?>'
		return xmlString.startsWith('<?xml')
			? xmlString
			: // biome-ignore lint/style/useTemplate: using templates literal would make the code less readable
				xmlStringRoot + '\n' + xmlString
	}
}
