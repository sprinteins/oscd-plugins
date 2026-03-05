import { buildEditForDeleteEmptyIed } from "../scl/edits"
import { getEditor } from "../utils"

export function deleteEmptyIed(iedName: string): void {
  const editor = getEditor()

	const edit = buildEditForDeleteEmptyIed(iedName)
	if (edit) {
		editor.commit(edit, {
			title: `Delete IED ${iedName}`
		})
	}
}