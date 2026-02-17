import { createSIED, createAccessPoints } from '@/headless/ied'
import type { AccessPointData } from './types'

export type SingleModeSubmission = {
	isMultiApMode: false
	isCreatingNewIed: boolean
	iedName: string
	iedDesc: string
	existingSIedName: string
	accessPoint: AccessPointData[] | undefined
}

export type MultiApModeSubmission = {
	isMultiApMode: true
	lockedIedName: string
	lockedIedDesc: string
	lockedIsNewIed: boolean
	pendingAccessPoints: AccessPointData[]
}

export type SubmissionData = SingleModeSubmission | MultiApModeSubmission

export function submitForm(data: SubmissionData): void {
	if (data.isMultiApMode) {
		if (data.lockedIsNewIed) {
			createSIED(
				data.lockedIedName,
				data.lockedIedDesc || undefined,
				data.pendingAccessPoints
			)
		} else {
			createAccessPoints(data.lockedIedName, data.pendingAccessPoints)
		}
	} else {
		if (data.isCreatingNewIed) {
			createSIED(
				data.iedName.trim(),
				data.iedDesc.trim() || undefined,
				data.accessPoint
			)
		} else if (data.accessPoint && data.existingSIedName) {
			createAccessPoints(data.existingSIedName, data.accessPoint)
		}
	}
}

export function buildAccessPoint(
	name: string,
	description: string
): AccessPointData[] | undefined {
	const trimmedName = name.trim()
	if (!trimmedName) return undefined

	return [
		{
			name: trimmedName,
			description: description.trim() || undefined
		}
	]
}
