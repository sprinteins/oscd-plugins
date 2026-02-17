export type AccessPointData = {
	name: string
	description?: string
}

export type IedFormData = {
	name: string
	description: string
}

export type AccessPointFormData = {
	name: string
	description: string
}

export type LockedIedState = {
	name: string
	description: string
	isNew: boolean
	pendingAccessPoints: AccessPointData[]
}

export type SubmissionParams = {
	iedName: string
	iedDescription?: string
	isNewIed: boolean
	accessPoints: AccessPointData[]
}
