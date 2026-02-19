import type { IedData, AccessPointData, DialogFormState } from './types'

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

export function createInitialFormState(): DialogFormState {
	return {
		ied: createInitialIedData(),
		currentAp: createInitialAccessPointForm(),
		accessPoints: [],
		isMultiApMode: false,
		error: null
	}
}
