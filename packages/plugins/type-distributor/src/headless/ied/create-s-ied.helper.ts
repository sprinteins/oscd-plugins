// CORE
import { createAndDispatchEditEvent } from '@oscd-plugins/core-api/plugin/v1'
import { pluginGlobalStore } from '@oscd-plugins/core-ui-svelte'

const DEFAULT_SIED_ATTRIBUTES = {
	configVersion: '1.0',
	engRight: 'full',
	manufacturer: 'none',
	originalSclRevision: 'B',
	originalSclVersion: '2007',
	type: 'none'
} as const

export function createSIED(params: { name: string, description?: string}) {
	if (!pluginGlobalStore.xmlDocument) {
		throw new Error('No XML document found')
	}
	if (!pluginGlobalStore.host) {
		throw new Error('No host element found')
	}

	const { name, description } = params

	const xmlDocument = pluginGlobalStore.xmlDocument

	const iedElement = xmlDocument.createElement('IED')

	for (const [key, value] of Object.entries(DEFAULT_SIED_ATTRIBUTES)) {
		iedElement.setAttribute(key, value)
	}

	iedElement.setAttribute('name', name)
	if (description) {
		iedElement.setAttribute('desc', description)
	}

	const servicesElement = xmlDocument.createElement('Services')
	servicesElement.setAttribute('nameLength', '64')
	iedElement.appendChild(servicesElement)

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
