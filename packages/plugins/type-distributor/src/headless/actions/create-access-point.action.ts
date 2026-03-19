import type {
	AccessPointData,
	IedData
} from '@/ui/components/columns/s-ied/create-ied-ap-dialog/form-helpers'
import { buildInsertsForCreateAccessPoint } from '../scl'
import { ssdImportStore } from '../stores'
import { getDocumentAndEditor } from '../utils'

export function createAccessPoint(
	ied: IedData,
	accessPoints: AccessPointData[]
): void {
	const { editor, doc } = getDocumentAndEditor()
	const { lnodeTypes, loadedSSDDocument } = ssdImportStore
	const accessPointEdits = buildInsertsForCreateAccessPoint({
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
