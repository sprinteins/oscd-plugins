import { pluginGlobalStore } from '@oscd-plugins/core-ui-svelte'
import { queryOwnServer, queryServerAtElement } from '../elements'
import type { FilteredAccessPoint, IEDData } from '../filters'
import { queryLDevicesFromAccessPoint } from './ldevice-queries'

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
	return queryIedElement(xmlDocument, iedName) !== null
}

export function queryIedElement(
	xmlDocument: XMLDocument | null | undefined,
	iedName: string
): Element | null {
	if (!xmlDocument) return null
	return xmlDocument.querySelector(`IED[name="${iedName}"]`)
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

export function queryServerHostApNamesFromIed(
	xmlDocument: XMLDocument | null | undefined,
	iedName: string
): string[] {
	const iedElement = queryIedElement(xmlDocument, iedName)
	if (!iedElement) return []

	return Array.from(iedElement.children)
		.filter((element) => element.localName === 'AccessPoint')
		.filter((accessPoint) => queryOwnServer(accessPoint) !== null)
		.map((accessPoint) => accessPoint.getAttribute('name'))
		.filter((name): name is string => Boolean(name))
}

export function queryIedDisplayData(iedItems: Element[]): IEDData[] {
	return iedItems.map((iedElement) => {
		const accessPoints = Array.from(
			iedElement.querySelectorAll(':scope > AccessPoint')
		).map((element): FilteredAccessPoint => {
			const serverAt = queryServerAtElement(element)
			return {
				element,
				name: element.getAttribute('name'),
				lDevices: queryLDevicesFromAccessPoint(element),
				serverAt: serverAt
					? { apName: serverAt.getAttribute('apName') ?? '' }
					: null
			}
		})

		return {
			name: iedElement.getAttribute('name') ?? 'Unnamed IED',
			element: iedElement,
			accessPoints
		}
	})
}
