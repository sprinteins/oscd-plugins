export type AccessPointData = {
	name: string
	description: string
}

export type IedData = {
	name: string
	description: string
	isNew: boolean
}

export type DialogFormState = {
	ied: IedData
	currentAp: AccessPointData
	accessPoints: AccessPointData[]
	isMultiApMode: boolean
	error: string | null
}
