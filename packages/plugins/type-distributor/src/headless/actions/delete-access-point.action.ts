import { buildEditsForDeleteAccessPoint } from '../scl/edits/'
import { bayStore } from '../stores'
import { getEditor } from '../utils'

type deleteAccessPointFromIedParams = {
	iedName: string
	accessPoint: Element
	hasLDevices: boolean
}

export function deleteAccessPointFromIed({
	iedName,
	accessPoint,
	hasLDevices
}: deleteAccessPointFromIedParams): void {
	const editor = getEditor()

	if (hasLDevices && !bayStore.scdBay) {
		console.error(
			'[AccessPoint] No bay selected - required to clear LNode references'
		)
		return
	}
	const edits = buildEditsForDeleteAccessPoint({
		accessPoint,
		iedName,
		selectedBay: bayStore.scdBay
	})
	if (!(edits.length > 0)) {
		console.warn(
			'[AccessPoint] No edits generated for deleting AccessPoint - check if it still exists'
		)
		return
	}
	editor.commit(edits, {
		title: `Delete AccessPoint ${accessPoint.getAttribute('name') ?? '(unnamed)'} from ${iedName}`
	})
}
