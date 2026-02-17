import { createSIED, createAccessPoints } from '@/headless/ied'
import type { AccessPointData, SubmissionParams } from './types'

export function submitForm(params: SubmissionParams): void {
	const { iedName, iedDescription, isNewIed, accessPoints } = params

	if (accessPoints.length === 0) {
		throw new Error('At least one Access Point is required')
	}

	if (isNewIed) {
		createSIED(iedName, iedDescription, accessPoints)
	} else {
		createAccessPoints(iedName, accessPoints)
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
