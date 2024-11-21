import { writable } from 'svelte/store'

const xmlDocument = writable<XMLDocument | undefined>()
const printContentWrapperElement = writable<HTMLElement | undefined>()

function init(newXmlDocument: XMLDocument) {
	xmlDocument.set(newXmlDocument)
}

export default {
	//state
	xmlDocument,
	printContentWrapperElement,
	//actions
	init
}
