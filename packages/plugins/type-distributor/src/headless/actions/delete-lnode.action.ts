import type { LNodeTemplate } from "../common-types"
import { buildEditsForDeleteLNodeFromAccessPoint } from "../scl/edits/delete-elements"
import { bayStore } from "../stores"
import { getEditor } from "../utils"

type deleteLnodeFromAccessPointParams = {
  lnode: LNodeTemplate
	iedName: string
	accessPoint: Element
}

export function deleteLnodeFromAccessPoint({iedName, accessPoint, lnode}: deleteLnodeFromAccessPointParams): void {
  const editor = getEditor()
	const edits = buildEditsForDeleteLNodeFromAccessPoint({
		iedName,
		accessPoint,
		lNodeTemplate: {
			lnClass: lnode.lnClass,
			lnType: lnode.lnType,
			lnInst: lnode.lnInst,
			ldInst: lnode.ldInst
		},
		selectedBay: bayStore.scdBay
	})
	if (!(edits.length > 0)) {
		console.warn(
			'[IedLnode] No edits generated for deleting LNode - check if LNode still exists'
		)
		return
	}
	editor.commit(edits, {
		title: `Delete LNode ${lnode.lnClass}`
	})
}