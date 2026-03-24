import { buildEditsForDeleteLDevice } from '../scl/edits'
import { bayStore } from '../stores'
import { getEditor } from '../utils'

type DeleteLDeviceParams = {
	iedName: string
	accessPoint: Element
	ldInst: string
}

export function deleteLDevice({
	iedName,
	accessPoint,
	ldInst
}: DeleteLDeviceParams): void {
	const editor = getEditor()
	const edits = buildEditsForDeleteLDevice({
		iedName,
		accessPoint,
		ldInst,
		selectedBay: bayStore.scdBay
	})
	if (!(edits.length > 0)) {
		console.warn(
			'[LDevice] No edits generated for deleting LDevice - check if LDevice still exists'
		)
		return
	}
	editor.commit(edits, {
		title: `Delete LDevice ${ldInst}`
	})
}
