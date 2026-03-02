import { createIED, createAccessPoints, createLD0 } from '@/headless/scl'
import type { LD0Source } from '@/headless/scl'
import type { AccessPointData, IedData } from './types'

export function submitForm(
	ied: IedData,
	accessPoints: AccessPointData[],
	ld0Source: LD0Source
): void {
	if (!ied.isNew && accessPoints.length === 0) {
		throw new Error('At least one Access Point is required')
	}

	if (ied.isNew) {
		createIED({
			name: ied.name,
			description: ied.description,
			accessPoints
		})
	} else {
		createAccessPoints({ iedName: ied.name, accessPoints })
	}

	//TODO: Should this be for each individual AP instead of all APs?
	for (const ap of accessPoints) {
		createLD0({ iedName: ied.name, apName: ap.name, source: ld0Source })
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
