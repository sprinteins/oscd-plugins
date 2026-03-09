import type { IedData, AccessPointData } from './types'
import type { LD0Source } from '@/headless/scl'

const DEFAULT_LD0_SOURCE: LD0Source = { kind: 'default', onlyMandatoryDOs: false }

export function createInitialIedData(): IedData {
	return {
		name: '',
		description: '',
		isNew: true
	}
}

export function createInitialAccessPoint(
	ld0Source: LD0Source = DEFAULT_LD0_SOURCE
): AccessPointData {
	return { name: '', description: '', ld0Source }
}

export function createInitialAccessPoints(
	ld0Source?: LD0Source
): AccessPointData[] {
	return [createInitialAccessPoint(ld0Source)]
}
