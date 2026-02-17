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

export type MultiApModeState = {
	isActive: boolean
	lockedIedName: string
	lockedIedDesc: string
	isNewIed: boolean
	pendingAccessPoints: AccessPointData[]
}
