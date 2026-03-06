import { createElement } from '@oscd-plugins/core'
import type { Insert } from '@openscd/oscd-api'
import { getDocument } from '../../utils'
import { createBasicIEDElement } from '../elements/ied-element'
import {
	queryIEDInsertionReference,
	queryAccessPointsFromIed,
	queryIedElement
} from '../queries'
import type { Remove } from '@openscd/oscd-api'

export function buildEditForCreateIed(
	name: string,
	description?: string
): Insert {
	const doc = getDocument()

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
	const doc = getDocument()

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

export function buildEditForDeleteEmptyIed(iedName: string): Remove | null {
	const doc = getDocument()
	const iedElement = queryIedElement(doc, iedName)

	if (!iedElement) {
		console.warn(`IED with name "${iedName}" not found.`)
		return null
	}

	const hasAccessPoints = queryAccessPointsFromIed(doc, iedName).length > 0
	if (hasAccessPoints) {
		console.warn(`IED with name "${iedName}" is not empty.`)
		return null
	}

	return { node: iedElement } as Remove
}
