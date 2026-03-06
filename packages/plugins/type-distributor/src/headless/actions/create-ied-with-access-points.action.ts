import type {
	AccessPointData,
	IedData
} from '@/ui/components/columns/s-ied/create-ied-ap-dialog/form-helpers'
import { buildEditsForCreateIedWithAccessPoints } from '../scl'
import { getEditor } from '../utils'

export function createIedWithAccessPoints(
	ied: IedData,
	accessPoints: AccessPointData[]
): void {
	const editor = getEditor()
	const edits = buildEditsForCreateIedWithAccessPoints({
		name: ied.name,
		description: ied.description,
		accessPoints
	})

	const title =
		accessPoints.length === 1
			? `Create IED "${ied.name}" with Access Point "${accessPoints[0].name}"`
			: `Create IED "${ied.name}" with ${accessPoints.length} Access Points`
	editor.commit(edits, { title })
}
