import {
	createAccessPoint,
	createIed,
	createIedWithAccessPoints
} from '@/headless/actions'
import type { AccessPointData, IedData } from './types'

export function submitForm(
	ied: IedData,
	accessPoints: AccessPointData[]
): void {
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
