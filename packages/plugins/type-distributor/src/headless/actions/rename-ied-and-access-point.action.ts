import {
	buildUpdatesForRenameAccessPoint,
	buildUpdatesForRenameIed
} from '../scl/edits'
import { assignedLNodesStore, bayStore } from '../stores'
import { getEditor } from '../utils'

type RenameIedAndAccessPointParams = {
	iedElement: Element
	accessPoint: Element
	oldIedName: string
	newIedName: string
	newIedDescription: string
	oldApName: string
	newApName: string
	newApDescription: string
}

export function renameIedAndAccessPoint({
	iedElement,
	accessPoint,
	oldIedName,
	newIedName,
	newIedDescription,
	oldApName,
	newApName,
	newApDescription
}: RenameIedAndAccessPointParams): void {
	const editor = getEditor()

	const iedEdits = buildUpdatesForRenameIed({
		iedElement,
		oldName: oldIedName,
		newName: newIedName,
		newDescription: newIedDescription,
		selectedBay: bayStore.scdBay
	})

	const apEdits = buildUpdatesForRenameAccessPoint({
		accessPoint,
		iedName: newIedName,
		oldName: oldApName,
		newName: newApName,
		newDescription: newApDescription
	})

	const allEdits = [...iedEdits, ...apEdits]
	if (allEdits.length === 0) return

	editor.commit(allEdits, {
		title: `Rename S-IED "${oldIedName}" to "${newIedName}" and Access Point "${oldApName}" to "${newApName}"`
	})

	assignedLNodesStore.rebuild()
}
