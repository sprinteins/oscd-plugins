import type {
	AccessPointData,
	IedData
} from '@/ui/components/columns/s-ied/create-ied-ap-dialog/form-helpers'
import {
	buildEditsForCreateAccessPoint,
	buildLD0EditsForServer
} from '../scl'
import { getDocumentAndEditor } from '../utils'

export function createAccessPoints(
	ied: IedData,
	accessPoints: AccessPointData[]
): void {
	const { doc, editor } = getDocumentAndEditor()
	const apEdits = buildEditsForCreateAccessPoint(ied.name, accessPoints)
	const ld0Edits = apEdits.flatMap((edit, i) => {
		const server = (edit.node as Element).querySelector('Server')
		if (!server) throw new Error('AccessPoint edit is missing Server element')
		return buildLD0EditsForServer({ doc, server, source: accessPoints[i].ld0Source })
	})
	const edits = [...apEdits, ...ld0Edits]
	if (accessPoints.length === 1) {
		editor.commit(edits, {
			title: `Add Access Point "${accessPoints[0].name}" to IED "${ied.name}"`
		})
	} else {
		editor.commit(edits, {
			title: `Add ${accessPoints.length} Access Points to IED "${ied.name}"`
		})
	}
}
