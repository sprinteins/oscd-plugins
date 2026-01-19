import type { Insert } from '@openscd/oscd-api'
import { pluginGlobalStore } from '@oscd-plugins/core-ui-svelte'

export function createAccessPoints(
	iedName: string,
	accessPoints: { name: string; description?: string }[]
): void {
	if (!pluginGlobalStore.xmlDocument) {
		throw new Error('No XML document found')
	}
	if (!pluginGlobalStore.editor) {
		throw new Error('No editor found')
	}
	const editor = pluginGlobalStore.editor
	const doc = pluginGlobalStore.xmlDocument

	const iedElement = doc.querySelector(`IED[name="${iedName}"]`)
	if (!iedElement) {
		throw new Error(`IED with name "${iedName}" not found`)
	}

	for (const ap of accessPoints) {
		const apElement = doc.createElement('AccessPoint')
		apElement.setAttribute('name', ap.name)
		if (ap.description !== undefined) {
			apElement.setAttribute('desc', ap.description)
		}

		const serverElement = doc.createElement('Server')
		const authElement = doc.createElement('Authentication')
		authElement.setAttribute('none', 'true')

		serverElement.appendChild(authElement)
		apElement.appendChild(serverElement)

		const edit: Insert = {
			node: apElement,
			parent: iedElement,
			reference: null
		}

		editor.commit(edit, {
			squash: true
		})
	}
}
