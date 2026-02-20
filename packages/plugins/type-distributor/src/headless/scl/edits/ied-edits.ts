import { pluginGlobalStore } from '@oscd-plugins/core-ui-svelte'
import type { Insert } from '@openscd/oscd-api'
import { createElement } from '@oscd-plugins/core'
import { getDocumentAndEditor } from '../../utils'
import { createBasicIEDElement } from '../elements/ied-element'
import { queryIEDInsertionReference } from '../queries'

export function createSIED(
	name: string,
	description?: string,
	accessPoints?: { name: string; description?: string }[]
): void {
	const { doc, editor } = getDocumentAndEditor()

	const iedElement = createBasicIEDElement(name, doc, description)
	const sclRoot = doc.documentElement

	const reference = queryIEDInsertionReference(sclRoot)

	const edit: Insert = {
		node: iedElement,
		parent: sclRoot,
		reference: reference
	}

	editor.commit(edit, {
		title: `Add SIED ${name}`
	})

	if (accessPoints && accessPoints.length > 0) {
		createAccessPoints(name, accessPoints, true)
	}
}

export function createAccessPoints(
	iedName: string,
	accessPoints: { name: string; description?: string }[],
	squash = false
): void {
	const { doc, editor } = getDocumentAndEditor()

	const iedElement = doc.querySelector(`IED[name="${iedName}"]`)
	if (!iedElement) {
		throw new Error(`IED with name "${iedName}" not found`)
	}

	for (const ap of accessPoints) {
		const apElement = createElement(doc, 'AccessPoint', {
			name: ap.name,
			desc: ap.description ?? null
		})

		const serverElement = createElement(doc, 'Server', {})

		const authElement = createElement(doc, 'Authentication', {
			none: 'true'
		})

		serverElement.appendChild(authElement)
		apElement.appendChild(serverElement)

		const edit: Insert = {
			node: apElement,
			parent: iedElement,
			reference: null
		}

		editor.commit(edit, {
			squash
		})
	}
}
