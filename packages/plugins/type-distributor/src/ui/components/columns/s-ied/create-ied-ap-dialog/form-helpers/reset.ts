import type { IedData, AccessPointData } from './types'

export function createInitialIedData(): IedData {
	return {
		name: '',
		description: '',
		isNew: true
	}
}

export function createInitialAccessPointForm(): AccessPointData {
	return { name: '', description: '' }
}
