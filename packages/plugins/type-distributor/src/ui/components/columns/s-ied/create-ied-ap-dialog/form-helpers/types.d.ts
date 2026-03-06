export type AccessPointData = {
	name: string
	description: string
}

export type IedData = {
	name: string
	description: string
	isNew: boolean
}

type FormattedField = { _errors: string[] }

export type FieldErrors = {
	_errors: string[]
	name?: FormattedField
	description?: FormattedField
}

export type FormErrors = {
	ied?: FieldErrors
	ap?: FieldErrors
}

export type AccessPointContext = {
	pendingNames: string[]
	existingNames: string[]
	iedName: string
}
