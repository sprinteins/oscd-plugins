import type { IedState, AccessPointData } from './types'

export type DialogFormState = {
	ied: IedState
	currentAp: AccessPointData
	accessPoints: AccessPointData[]
	isMultiApMode: boolean
	error: string | null
}

export function createInitialIedState(): IedState {
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
		ied: createInitialIedState(),
		currentAp: createInitialAccessPointForm(),
		accessPoints: [],
		isMultiApMode: false,
		error: null
	}
}
