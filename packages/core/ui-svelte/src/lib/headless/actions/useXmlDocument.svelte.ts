import { writable } from 'svelte/store'

export function useXmlDocument({
	updateTrigger,
	newXmlDocument
}: {
	updateTrigger: number
	newXmlDocument: XMLDocument | undefined
}) {

	//====== STATE ======//

	const xmlDocument = writable<XMLDocument | undefined>()

	//====== WATCHERS ======//

	$effect.root(() => {
		triggerUpdate({
			updateTrigger,
			newXmlDocument
		})
	})

	//====== PRIVATE FUNCTIONS ======//

	function triggerUpdate({
		updateTrigger, // is not used but should be passed to the function to trigger reactivity
		newXmlDocument
	}: {
		updateTrigger: number
		newXmlDocument: XMLDocument | undefined
	}) {
		if (newXmlDocument) xmlDocument.set(newXmlDocument)
	}

	//====== RETURN UTILITIES ======//

	return {
		//state
		xmlDocument,
	}
}