// SVELTE
import { writable } from 'svelte/store'

//====== STATE ======//
const xmlDocument = writable<XMLDocument | undefined>(undefined)
const pluginHostElement = writable<Element>()

//====== INITIALIZATION ======//

function init({
	newXMLDocument,
	newPluginHostElement
}: { newXMLDocument: XMLDocument | undefined; newPluginHostElement: Element }) {
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
