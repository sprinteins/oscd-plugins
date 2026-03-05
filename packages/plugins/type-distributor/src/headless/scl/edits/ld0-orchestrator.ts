import { getDocumentAndEditor } from '@/headless/utils'
import { buildLD0Edits } from './ld0-edits'
import type { LD0Source } from './ld0-edits'
import { ensureDataTypeTemplates } from './data-type-edits'

type CreateLD0Params = {
	iedName: string
	apName: string
	source: LD0Source
}

export function createLD0({ iedName, apName, source }: CreateLD0Params): void {
	const { doc, editor } = getDocumentAndEditor()
	const edits = []

	const server = doc.querySelector(
		`IED[name="${iedName}"] AccessPoint[name="${apName}"] Server`
	)
	if (!server) {
		console.warn('[createLD0] Server element not found for', {
			iedName,
			apName
		})
		return
	}

	const { element: dataTypeTemplates, edit: dtsCreationEdit } =
		ensureDataTypeTemplates(doc)

	if (dtsCreationEdit) edits.push(dtsCreationEdit)

	const ld0Edits = buildLD0Edits({ doc, server, dataTypeTemplates, source })
	edits.push(...ld0Edits)

	editor.commit(edits, { title: `Add LD0 to ${iedName}/${apName}` })
}
