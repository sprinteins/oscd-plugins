export type AccessPointData = {
	name: string
	description: string
}

export type IedState = {
	name: string
	description: string
	isNew: boolean
}

export type SubmissionParams = {
	iedName: string
	iedDescription?: string
	isNewIed: boolean
	accessPoints: AccessPointData[]
}
