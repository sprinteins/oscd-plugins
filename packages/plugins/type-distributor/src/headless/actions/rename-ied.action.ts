import { buildUpdatesForRenameIed } from '../scl/edits'
import { assignedLNodesStore, bayStore } from '../stores'
import { getEditor } from '../utils'

type RenameIedParams = {
	iedElement: Element
	oldName: string
	newName: string
	newDescription: string
}

export function renameIed({
	iedElement,
	oldName,
	newName,
	newDescription
}: RenameIedParams): void {
	const editor = getEditor()

	const edits = buildUpdatesForRenameIed({
		iedElement,
		oldName,
		newName,
		newDescription,
		selectedBay: bayStore.scdBay
	})

	if (edits.length > 0) {
		editor.commit(edits, {
			title: `Rename S-IED from "${oldName}" to "${newName}"`
		})

		assignedLNodesStore.rebuild()
	}
}
