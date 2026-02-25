import type { Insert } from '@openscd/oscd-api'
import { createElement } from '@oscd-plugins/core'
import { getDocumentAndEditor } from '../utils';

type CreateAccessPointsParams = {
	iedName: string
	accessPoints: { name: string; description?: string }[]
	squash?: boolean
}

export function createAccessPoints({
	iedName,
	accessPoints,
	squash = false
}: CreateAccessPointsParams): void {
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
