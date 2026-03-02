import { pluginGlobalStore } from '@oscd-plugins/core-ui-svelte'

export function queryIEDs(selectedBay: string): Element[] {
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

		const bayForIED = queryBayByIEDName(xmlDocument, iedName)

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

export function queryIedExists(
	xmlDocument: XMLDocument | null | undefined,
	iedName: string
): boolean {
	if (!xmlDocument) return false
	return xmlDocument.querySelector(`IED[name="${iedName}"]`) !== null
}

function queryBayByIEDName(
	xmlDocument: XMLDocument,
	iedName: string
): string | null {
	const selector = `Substation VoltageLevel Bay LNode[iedName='${iedName}']`
	const lnode = xmlDocument.querySelector(selector)
	const bayName = lnode?.closest('Bay')?.getAttribute('name') || null
	return bayName
}

export function queryIEDInsertionReference(root: Element): Element | null {
	const existingIEDs = root.querySelectorAll(':scope > IED')
	const dataTypeTemplates = root.querySelector(':scope > DataTypeTemplates')

	if (dataTypeTemplates) return dataTypeTemplates
	if (existingIEDs.length > 0) {
		const lastIED = existingIEDs[existingIEDs.length - 1]
		return lastIED.nextElementSibling
	}
	return null
}

export function queryAccessPointsFromIed(
	xmlDocument: XMLDocument | null | undefined,
	iedName: string
): string[] {
	if (!xmlDocument) return []

	const accessPoints = Array.from(
		xmlDocument.querySelectorAll(`IED[name="${iedName}"] AccessPoint`)
	)
	return accessPoints
		.map((ap) => ap.getAttribute('name'))
		.filter((name): name is string => name !== null)
}
