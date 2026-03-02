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
