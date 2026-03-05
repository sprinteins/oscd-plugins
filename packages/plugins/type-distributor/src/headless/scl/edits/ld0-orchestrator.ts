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
	console.log('[createLD0] called', { iedName, apName, source })

	const { doc, editor } = getDocumentAndEditor()
	const edits = []

	const server = doc.querySelector(
		`IED[name="${iedName}"] AccessPoint[name="${apName}"] Server`
	)
	if (!server) {
		console.warn('[createLD0] Server element not found for', { iedName, apName })
		return
	}

	const { element: dataTypeTemplates, edit: dtsCreationEdit } =
		ensureDataTypeTemplates(doc)

	if (dtsCreationEdit) {
		console.log('[createLD0] DataTypeTemplates did not exist — creating it')
		edits.push(dtsCreationEdit)
	} else {
		console.log('[createLD0] DataTypeTemplates already exists')
	}

	const ld0Edits = buildLD0Edits({ doc, server, dataTypeTemplates, source })
	console.log(`[createLD0] buildLD0Edits returned ${ld0Edits.length} edit(s)`)
	if (ld0Edits.length === 0) {
		console.warn('[createLD0] No edits produced — LDevice[inst="LD0"] may already exist')
		return
	}
	edits.push(...ld0Edits)

	console.log(`[createLD0] committing ${edits.length} total edit(s)`)
	editor.commit(edits, { title: `Add LD0 to ${iedName}/${apName}` })
}
