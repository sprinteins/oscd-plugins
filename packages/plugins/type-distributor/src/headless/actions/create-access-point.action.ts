import type {
	AccessPointData,
	IedData
} from '@/ui/components/columns/s-ied/create-ied-ap-dialog/form-helpers'
import { buildEditsForCreateAccessPoint } from '../scl'
import { getEditor } from '../utils'

export function createAccessPoint(
	ied: IedData,
	accessPoints: AccessPointData[]
): void {
	const editor = getEditor()

	const accessPointEdits = buildEditsForCreateAccessPoint(
		ied.name,
		accessPoints
	)
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
