import type {
	AccessPointData,
	IedData
} from '@/ui/components/columns/s-ied/create-ied-ap-dialog/form-helpers'
import {
	buildEditsForCreateIedWithAccessPoints,
	buildLD0EditsForServer
} from '../scl'
import { getDocumentAndEditor } from '../utils'

export function createIedWithAccessPoints(
	ied: IedData,
	accessPoints: AccessPointData[]
): void {
	const { doc, editor } = getDocumentAndEditor()
	const iedAndApEdits = buildEditsForCreateIedWithAccessPoints({
		name: ied.name,
		description: ied.description,
		accessPoints
	})

	const apEdits = iedAndApEdits.slice(1)
	const ld0Edits = apEdits.flatMap((edit, i) => {
		const server = (edit.node as Element).querySelector('Server')
		if (!server) throw new Error('AccessPoint edit is missing Server element')
		return buildLD0EditsForServer({ doc, server, source: accessPoints[i].ld0Source })
	})

	const edits = [...iedAndApEdits, ...ld0Edits]
	const title =
		accessPoints.length === 1
			? `Create IED "${ied.name}" with Access Point "${accessPoints[0].name}"`
			: `Create IED "${ied.name}" with ${accessPoints.length} Access Points`
	editor.commit(edits, { title })
}
