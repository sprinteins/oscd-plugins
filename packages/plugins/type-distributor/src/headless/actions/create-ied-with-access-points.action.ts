import type {
	AccessPointData,
	IedData
} from '@/ui/components/columns/s-ied/create-ied-ap-dialog/form-helpers'
import { buildInsertsForCreateIedWithAccessPoints } from '../scl'
import { getEditor } from '../utils'
import { ssdImportStore } from '../stores'

export function createIedWithAccessPoints(
	ied: IedData,
	accessPoints: AccessPointData[]
): void {
	const editor = getEditor()
	const { lnodeTypes, loadedSSDDocument } = ssdImportStore
	const edits = buildInsertsForCreateIedWithAccessPoints({
		name: ied.name,
		description: ied.description,
		accessPoints,
		lnodeTypes,
		ssdDoc: loadedSSDDocument
	})

	const title =
		accessPoints.length === 1
			? `Create IED "${ied.name}" with Access Point "${accessPoints[0].name}"`
			: `Create IED "${ied.name}" with ${accessPoints.length} Access Points`
	editor.commit(edits, { title })
}
