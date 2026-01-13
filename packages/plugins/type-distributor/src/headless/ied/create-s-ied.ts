import { createAndDispatchEditEvent } from '@oscd-plugins/core-api/plugin/v1'
import { pluginGlobalStore } from '@oscd-plugins/core-ui-svelte'
import { createBasicIEDElement } from './create-basic-ied-element.helper'
import { createAccessPoints } from './create-accesspoints'

export function createSIED(
	name: string,
	description?: string,
	accessPoints?: { name: string; description?: string }[]
): void {
	if (!pluginGlobalStore.xmlDocument) {
		throw new Error('No XML document found')
	}
	if (!pluginGlobalStore.host) {
		throw new Error('No host element found')
	}

	const xmlDocument = pluginGlobalStore.xmlDocument

	let iedElement = createBasicIEDElement(name, xmlDocument, description)

	if (accessPoints && accessPoints.length > 0) {
		iedElement = createAccessPoints(iedElement, accessPoints)
	}
	const sclRoot = xmlDocument.documentElement

	const reference = findSclInsertionReference(sclRoot)

	createAndDispatchEditEvent({
		host: pluginGlobalStore.host,
		edit: {
			node: iedElement,
			parent: sclRoot,
			reference: reference
		}
	})
}

function findSclInsertionReference(root: Element): Element | null {
	const existingIEDs = root.querySelectorAll(':scope > IED')
	const dataTypeTemplates = root.querySelector(':scope > DataTypeTemplates')

	if (dataTypeTemplates) return dataTypeTemplates
	if (existingIEDs.length > 0) {
		const lastIED = existingIEDs[existingIEDs.length - 1]
		return lastIED.nextElementSibling
	}
	return null
}
