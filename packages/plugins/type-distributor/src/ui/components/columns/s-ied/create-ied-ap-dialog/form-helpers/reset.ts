import type { IedData, AccessPointData } from './types'

export function createInitialIedData(): IedData {
	return {
		name: '',
		description: '',
		isNew: true
	}
}

export function createInitialAccessPoint(): AccessPointData {
	return { name: '', description: '' }
}

export function createInitialAccessPoints(): AccessPointData[] {
	return [createInitialAccessPoint()]
}
