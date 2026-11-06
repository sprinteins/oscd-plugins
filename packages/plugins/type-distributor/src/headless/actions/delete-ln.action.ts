import type { IedLNData } from '../common-types'
import { buildEditsForDeleteLNFromAccessPoint } from '../scl/edits'
import { bayStore } from '../stores'
import { getEditor } from '../utils'

type deleteLNFromAccessPointParams = {
	ln: IedLNData
	iedName: string
	accessPoint: Element
}

export function deleteLNFromAccessPoint({
	iedName,
	accessPoint,
	ln
}: deleteLNFromAccessPointParams): void {
	const editor = getEditor()
	const edits = buildEditsForDeleteLNFromAccessPoint({
		iedName,
		accessPoint,
		ln,
		selectedBay: bayStore.scdBay
	})
	if (!(edits.length > 0)) {
		console.warn(
			'[IedLN] No edits generated for deleting LN - check if LN still exists'
		)
		return
	}
	editor.commit(edits, {
		title: `Delete LN ${ln.lnClass}`
	})
}
