import type { IedFormData, AccessPointFormData, LockedIedState } from './types'

export type DialogFormState = {
	iedForm: IedFormData
	accessPointForm: AccessPointFormData
	existingSIedName: string
	lockedIed: LockedIedState
	isMultiApMode: boolean
	iedCreationError: string | null
}

export function createInitialFormState(): DialogFormState {
	return {
		iedForm: { name: '', description: '' },
		accessPointForm: { name: '', description: '' },
		existingSIedName: '',
		lockedIed: {
			name: '',
			description: '',
			isNew: false,
			pendingAccessPoints: []
		},
		isMultiApMode: false,
		iedCreationError: null
	}
}

export function resetForm(): DialogFormState {
	return createInitialFormState()
}

export function resetAccessPointForm(
): AccessPointFormData {
	return { name: '', description: '' }
}

export function resetPendingAccessPoints(
	lockedIed: LockedIedState
): LockedIedState {
	return {
		...lockedIed,
		pendingAccessPoints: []
	}
}
