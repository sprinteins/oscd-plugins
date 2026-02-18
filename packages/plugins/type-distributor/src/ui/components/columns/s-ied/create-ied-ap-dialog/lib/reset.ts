import type { IedData, AccessPointData } from './types'

export type DialogFormState = {
	ied: IedData
	currentAp: AccessPointData
	accessPoints: AccessPointData[]
	isMultiApMode: boolean
	error: string | null
}

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
