import { buildUpdatesForRenameAccessPoint } from '../scl/edits'
import { assignedLNodesStore } from '../stores'
import { getEditor } from '../utils'

type RenameAccessPointParams = {
	accessPoint: Element
	iedName: string
	oldName: string
	newName: string
	newDescription: string
}

export function renameAccessPoint({
	accessPoint,
	iedName,
	oldName,
	newName,
	newDescription
}: RenameAccessPointParams): void {
	const editor = getEditor()

	const edits = buildUpdatesForRenameAccessPoint({
		accessPoint,
		iedName,
		oldName,
		newName,
		newDescription
	})

	if (edits.length === 0) return

	editor.commit(edits, {
		title: `Rename Access Point "${oldName}" to "${newName}" in S-IED "${iedName}"`
	})

	assignedLNodesStore.rebuild()
}
