// SVELTE
import { writable } from 'svelte/store'

//====== STATE ======//
const xmlDocument = writable<XMLDocument | undefined>(undefined)
const pluginHostElement = writable<Element>()
const editCount = writable<number>()

//====== INITIALIZATION ======//

function init({
	newXMLDocument,
	newPluginHostElement,
	newEditCount
}: { newXMLDocument: XMLDocument | undefined; newPluginHostElement: Element, newEditCount: number }) {
	xmlDocument.set(newXMLDocument)
	pluginHostElement.set(newPluginHostElement)
	editCount.set(newEditCount)
}

export const pluginStore = {
	//state
	xmlDocument,
	pluginHostElement,
	editCount,
	//initialization
	init
}
