import { createElement } from '@oscd-plugins/core'
import type { Insert } from '@openscd/oscd-api'
import { getDocumentAndEditor } from '../../utils'
import { createBasicIEDElement } from '../elements/ied-element'
import { queryIEDInsertionReference } from '../queries'

export function buildEditForCreateIed(
	name: string,
	description?: string
): Insert {
	const { doc } = getDocumentAndEditor()

	const iedElement = createBasicIEDElement(name, doc, description)
	const sclRoot = doc.documentElement

	const reference = queryIEDInsertionReference(sclRoot)

	const edit: Insert = {
		node: iedElement,
		parent: sclRoot,
		reference: reference
	}

	return edit
}

type buildEditsForCreateIedWithAccessPointsParams = {
	name: string
	description?: string
	accessPoints: { name: string; description?: string }[]
}

export function buildEditsForCreateIedWithAccessPoints({
	name,
	description,
	accessPoints
}: buildEditsForCreateIedWithAccessPointsParams): Insert[] {
	const { doc } = getDocumentAndEditor()

	const iedElement = createBasicIEDElement(name, doc, description)
	const sclRoot = doc.documentElement
	const reference = queryIEDInsertionReference(sclRoot)

	const iedEdit: Insert = {
		node: iedElement,
		parent: sclRoot,
		reference
	}

	const apEdits: Insert[] = accessPoints.map((ap) => {
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

		return {
			node: apElement,
			parent: iedElement,
			reference: null
		}
	})

	return [iedEdit, ...apEdits]
}
