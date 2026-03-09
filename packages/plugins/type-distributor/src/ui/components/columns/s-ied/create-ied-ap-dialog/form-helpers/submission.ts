import type { LD0Source } from '@/headless/scl'
import type { AccessPointData, IedData } from './types'
import {
	createAccessPoints,
	createIed,
	createIedWithAccessPoints
} from '@/headless/actions'

export function submitForm(
	ied: IedData,
	accessPoints: AccessPointData[],
	ld0Source: LD0Source
): void {
	if (ied.isNew && accessPoints.length > 0) {
		createIedWithAccessPoints(ied, accessPoints, ld0Source)
		return
	}

	if (ied.isNew) {
		createIed(ied)
		return
	}

	createAccessPoints(ied, accessPoints, ld0Source)
}
