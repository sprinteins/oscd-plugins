import { createIED, createAccessPoints } from '@/headless/scl'
import type { AccessPointData, IedData } from './types'

export function submitForm(
	ied: IedData,
	accessPoints: AccessPointData[]
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
		createAccessPoints({iedName: ied.name, accessPoints})
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
