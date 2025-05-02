import { tick } from 'svelte'
// CORE
import { createAndDispatchEditEvent } from '@oscd-plugins/core-api/plugin/v1'
import { pluginGlobalStore } from '@oscd-plugins/core-ui-svelte'
// STORES
import { iedStore } from '@/headless/stores'

function getElementPayload(
	elementToCreate: 'accessPoint' | 'server' | 'lDevice'
) {
	return {
		accessPoint: {
			tag: 'AccessPoint',
			attributes: {
				name: 'AP1',
				uuid: crypto.randomUUID()
			},
			parent: iedStore.currentIedSubElements.accessPoint
		},
		server: {
			tag: 'Server',
			attributes: {
				uuid: crypto.randomUUID()
			},
			parent: iedStore.currentIedSubElements.server
		},
		lDevice: {
			tag: 'LDevice',
			attributes: {
				inst: 'LD0',
				uuid: crypto.randomUUID()
			},
			parent: iedStore.currentIedSubElements.lDevice
		}
	}[elementToCreate]
}

async function createRequiredElement(
	elementToCreate: 'accessPoint' | 'server' | 'lDevice'
) {
	if (!pluginGlobalStore.xmlDocument) throw new Error('no xml document found')
	if (!pluginGlobalStore.host) throw new Error('no host element found')
	if (!iedStore.selectedIED?.element) throw new Error('no ied element found')

	await tick()

	const { tag, attributes, parent } = getElementPayload(elementToCreate)
	if (!parent) throw new Error('no parent element found')

	const createdElement = pluginGlobalStore.xmlDocument.createElement(tag)

	for (const [attributeKey, attributeValue] of Object.entries(attributes)) {
		createdElement.setAttribute(attributeKey, attributeValue)
	}

	createAndDispatchEditEvent({
		host: pluginGlobalStore.host,
		edit: { node: createdElement, parent, reference: null }
	})
}

export async function createIedRequiredElements() {
	if (!iedStore.currentIedSubElements.accessPoint)
		await createRequiredElement('accessPoint')
	if (!iedStore.currentIedSubElements.server)
		await createRequiredElement('server')
	if (!iedStore.currentIedSubElements.lDevice)
		await createRequiredElement('lDevice')
}
