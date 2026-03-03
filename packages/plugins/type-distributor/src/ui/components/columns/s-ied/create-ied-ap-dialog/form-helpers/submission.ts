import type { AccessPointData, IedData } from './types'
import {
	createAccessPoint,
	createIed,
	createIedWithAccessPoints
} from '@/headless/actions'

export function submitForm(
	ied: IedData,
	accessPoints: AccessPointData[]
): void {
	if (!ied.isNew && accessPoints.length === 0) {
		throw new Error('At least one Access Point is required')
	}
	if (ied.isNew && accessPoints.length > 0) {
		createIedWithAccessPoints(ied, accessPoints)
		return
	}
	if (ied.isNew) {
		createIed(ied)
		return
	}
	createAccessPoint(ied, accessPoints)
}
