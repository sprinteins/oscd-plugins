import { createSIED, createAccessPoints } from '@/headless/ied'
import type { AccessPointData, IedData } from './types'

export function submitForm(ied: IedData, accessPoints: AccessPointData[]): void {
	if (accessPoints.length === 0) {
		throw new Error('At least one Access Point is required')
	}

	if (ied.isNew) {
		createSIED(ied.name, ied.description, accessPoints)
	} else {
		createAccessPoints(ied.name, accessPoints)
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
