import type { AccessPointData, IedData } from './types'
import { createAccessPoint, createIed } from '@/headless/actions'

export function submitForm(
	ied: IedData,
	accessPoints: AccessPointData[]): void {
	if (!ied.isNew && accessPoints.length === 0) {
		throw new Error('At least one Access Point is required')
	}

	if (ied.isNew) {
		createIed(ied)
	}
	createAccessPoint(ied, accessPoints)
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
