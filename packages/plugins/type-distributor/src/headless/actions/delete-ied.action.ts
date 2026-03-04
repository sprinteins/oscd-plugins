import { buildEditsForDeleteEmptyIed } from "../scl/edits/delete-elements"
import { getEditor } from "../utils"

export function deleteEmptyIed(iedName: string): void {
  const editor = getEditor()
  
	const edit = buildEditsForDeleteEmptyIed(iedName)
	editor.commit(edit, {
		title: `Delete IED ${iedName}`
	})
}