export type AccessPointData = {
	name: string
	description: string
}

export type IedData = {
	name: string
	description: string
	isNew: boolean
}

export type FieldErrors = Partial<Record<'name' | 'description', string>>

export type FormErrors = {
	ied?: FieldErrors
	ap?: FieldErrors
}

export type AccessPointContext = {
	pendingNames: string[]
	existingNames: string[]
	iedName: string
}
