import { pluginGlobalStore } from '@oscd-plugins/core-ui-svelte'

export function getSIEDs(selectedBay: string): Element[] {
	const xmlDocument = pluginGlobalStore.xmlDocument
	if (!xmlDocument) {
		return []
	}

	const allIEDs = Array.from(xmlDocument.querySelectorAll('IED'))
	
	if (!allIEDs.length) {
		return []
	}

	const filteredIEDs: Element[] = []
	
	for (const ied of allIEDs) {
		const iedName = ied.getAttribute('name')
		if (!iedName) continue

		const bayForIED = getBayByIEDName(xmlDocument, iedName)
		
		if (!bayForIED) {
			filteredIEDs.push(ied)
		} else {
			const hasSelectedBay = selectedBay === bayForIED
			if (hasSelectedBay) {
				filteredIEDs.push(ied)
			}
		}
	}

	return filteredIEDs
}

function getBayByIEDName(xmlDocument: XMLDocument, iedName: string): string | null {
	const selector = `Substation VoltageLevel Bay LNode[iedName='${iedName}']`
	const lnode = xmlDocument.querySelector(selector)
	const bayName = lnode?.closest('Bay')?.getAttribute('name') || null
	return bayName
}
