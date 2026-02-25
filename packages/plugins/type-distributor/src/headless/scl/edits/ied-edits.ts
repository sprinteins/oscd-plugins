import type { Insert } from '@openscd/oscd-api'
import { getDocumentAndEditor } from '../../utils'
import { createBasicIEDElement } from '../elements/ied-element'
import { queryIEDInsertionReference } from '../queries'
import { createAccessPoints } from './accesspoint-edits'

type CreateIEDParams = {
	name: string
	description?: string
	accessPoints?: { name: string; description?: string }[]
}

export function createIED({
	name,
	description,
	accessPoints
}: CreateIEDParams): void {
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
		createAccessPoints({ iedName: name, accessPoints, squash: true })
	}
}
