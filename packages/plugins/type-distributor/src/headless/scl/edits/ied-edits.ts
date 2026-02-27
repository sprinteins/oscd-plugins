import type { Insert } from '@openscd/oscd-api'
import { getDocumentAndEditor } from '../../utils'
import { createBasicIEDElement } from '../elements/ied-element'
import { queryIEDInsertionReference } from '../queries'
import { buildEditsForCreateAccessPoint } from './accesspoint-edits'

type buildEditsForCreateIEDParams = {
	name: string
	description?: string
	accessPoints?: { name: string; description?: string }[]
}

export function buildEditsForCreateIED({
	name,
	description,
	accessPoints
}: buildEditsForCreateIEDParams): Insert[] {
	const { doc } = getDocumentAndEditor()

	const iedElement = createBasicIEDElement(name, doc, description)
	const sclRoot = doc.documentElement

	const reference = queryIEDInsertionReference(sclRoot)

	const edit: Insert = {
		node: iedElement,
		parent: sclRoot,
		reference: reference
	}

	if (accessPoints && accessPoints.length > 0) {
		const accessPointEdits = buildEditsForCreateAccessPoint({
			iedName: name,
			accessPoints
		})
		return [edit, ...accessPointEdits]
	}

	return [edit]
}
