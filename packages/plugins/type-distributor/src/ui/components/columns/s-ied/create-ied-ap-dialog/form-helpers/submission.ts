import {
	buildEditsForCreateIED,
	buildEditsForCreateAccessPoint
} from '@/headless/scl'
import type { AccessPointData, IedData } from './types'
import type { XMLEditor } from '@openscd/oscd-editor'

type SubmitFormParams = {
	ied: IedData
	accessPoints: AccessPointData[]
	editor: XMLEditor
}

export function submitForm({
	ied,
	accessPoints,
	editor
}: SubmitFormParams): void {
	if (!ied.isNew && accessPoints.length === 0) {
		throw new Error('At least one Access Point is required')
	}

	if (ied.isNew) {
		const iedEdits = buildEditsForCreateIED({
			name: ied.name,
			description: ied.description,
		})
		editor.commit(iedEdits, {
			title: `Create IED "${ied.name}"`
		})

		if (accessPoints.length > 0) {
			const apEdits = buildEditsForCreateAccessPoint({
				iedName: ied.name,
				accessPoints
			})
			if (accessPoints.length === 1) {
				editor.commit(apEdits, {
					title: `Add Access Point "${accessPoints[0].name}" to IED "${ied.name}"`
				})
			} else {
				editor.commit(apEdits, {
					title: `Add ${accessPoints.length} Access Points to IED "${ied.name}"`
				})
			}
		}
	} else {
		const edits = buildEditsForCreateAccessPoint({
			iedName: ied.name,
			accessPoints
		})
		if (accessPoints.length === 1)
			editor.commit(edits, {
				title: `Add Access Point "${accessPoints[0].name}" to IED "${ied.name}"`
			})
		else {
			editor.commit(edits, {
				title: `Add ${accessPoints.length} Access Points to IED "${ied.name}"`
			})
		}
	}
}

export function buildAccessPoint(
	name: string,
	description: string
): AccessPointData | undefined {
	const trimmedName = name.trim()
	if (!trimmedName) return undefined

	return {
		name: trimmedName,
		description: description.trim()
	}
}
