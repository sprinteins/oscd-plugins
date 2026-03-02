import { getDocumentAndEditor } from '@/headless/utils'
import { buildLD0Edits } from './ld0-edits'
import type { LD0Source } from './ld0-edits'

type CreateLD0Params = {
	iedName: string
	apName: string
	source: LD0Source
}

export function createLD0({ iedName, apName, source }: CreateLD0Params): void {
	const { doc, editor } = getDocumentAndEditor()

	const server = doc.querySelector(
		`IED[name="${iedName}"] AccessPoint[name="${apName}"] Server`
	)
	if (!server) return

    //TODO: We should create this
	const dataTypeTemplates = doc.querySelector('DataTypeTemplates')
	if (!dataTypeTemplates) return

	const edits = buildLD0Edits({ doc, server, dataTypeTemplates, source })
	if (edits.length === 0) return

	editor.commit(edits, { title: `Add LD0 to ${iedName}/${apName}` })
}
