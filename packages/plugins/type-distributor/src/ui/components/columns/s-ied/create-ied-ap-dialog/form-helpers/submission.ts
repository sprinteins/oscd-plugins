import { createLD0 } from '@/headless/scl'
import type { LD0Source } from '@/headless/scl'
import type { AccessPointData, IedData } from './types'
import {
	createAccessPoint,
	createIed,
	createIedWithAccessPoints
} from '@/headless/actions'

export function submitForm(
	ied: IedData,
	accessPoints: AccessPointData[],
	ld0Source: LD0Source
): void {
	if (ied.isNew && accessPoints.length > 0) {
		createIedWithAccessPoints(ied, accessPoints)
		for (const ap of accessPoints) {
			createLD0({ iedName: ied.name, apName: ap.name, source: ld0Source })
		}
		return
	}

	//TODO: Should this be for each individual AP instead of all APs?
	for (const ap of accessPoints) {
		createLD0({ iedName: ied.name, apName: ap.name, source: ld0Source })
	}

	if (ied.isNew) {
		createIed(ied)
		return
	}
	createAccessPoint(ied, accessPoints)
}
