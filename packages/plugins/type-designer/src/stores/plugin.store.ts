// SVELTE
import { writable, get, derived } from 'svelte/store'

//====== STATE ======//
const xmlDocument = writable<XMLDocument>()
const pluginHostElement = writable<Element>()

//====== INITIALIZATION ======//

function init({
	newXMLDocument,
	newPluginHostElement
}: { newXMLDocument: XMLDocument; newPluginHostElement: Element }) {
	xmlDocument.set(newXMLDocument)
	pluginHostElement.set(newPluginHostElement)
}

export const pluginStore = {
	//state
	xmlDocument,
	pluginHostElement,
	//initialization
	init
}
