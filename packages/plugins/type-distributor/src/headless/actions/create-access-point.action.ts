import type {
	AccessPointData,
	IedData
} from '@/ui/components/columns/s-ied/create-ied-ap-dialog/form-helpers'
import { buildEditsForCreateAccessPoint } from '../scl'
import { getDocumentAndEditor, getEditor } from '../utils'
import { ssdImportStore } from '../stores'

export function createAccessPoint(
	ied: IedData,
	accessPoints: AccessPointData[]
): void {
	const { editor, doc } = getDocumentAndEditor()
	const { lnodeTypes, loadedSSDDocument } = ssdImportStore
	const accessPointEdits = buildEditsForCreateAccessPoint({
		iedName: ied.name,
		accessPoints,
		lnodeTypes,
		doc,
		ssdDoc: loadedSSDDocument
	})
	if (accessPoints.length === 1) {
		editor.commit(accessPointEdits, {
			title: `Add Access Point "${accessPoints[0].name}" to IED "${ied.name}"`
		})
	} else {
		editor.commit(accessPointEdits, {
			title: `Add ${accessPoints.length} Access Points to IED "${ied.name}"`
		})
	}
}
