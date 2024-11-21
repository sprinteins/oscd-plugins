import { writable } from 'svelte/store'

const xmlDocument = writable<XMLDocument | undefined>()

function init(newXmlDocument: XMLDocument) {
	xmlDocument.set(newXmlDocument)
}

export default {
	//state
	xmlDocument,
	//actions
	init
}
