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
		const edits = buildEditsForCreateIED({
			name: ied.name,
			description: ied.description,
			accessPoints
		})
		editor.commit(edits, {
			title: `Create IED ${ied.name} with ${accessPoints.length} Access Points`
		})
	} else {
		const edits = buildEditsForCreateAccessPoint({
			iedName: ied.name,
			accessPoints
		})
		editor.commit(edits, {
			title: `Add ${accessPoints.length} Access Points to IED ${ied.name}`
		})
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
