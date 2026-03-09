import type { Insert } from '@openscd/oscd-api'
import { buildLD0Edits } from './ld0-edits'
import type { LD0Source } from './ld0-edits'
import { ensureDataTypeTemplates } from './data-type-edits'

export type { LD0Source }

type BuildLD0EditsForServerParams = {
	doc: XMLDocument
	server: Element
	source: LD0Source
}

export function buildLD0EditsForServer({
	doc,
	server,
	source
}: BuildLD0EditsForServerParams): Insert[] {
	const edits: Insert[] = []

	const { element: dataTypeTemplates, edit: dtsCreationEdit } =
		ensureDataTypeTemplates(doc)

	if (dtsCreationEdit) edits.push(dtsCreationEdit)

	const ld0Edits = buildLD0Edits({ doc, server, dataTypeTemplates, source })
	edits.push(...ld0Edits)

	return edits
}
