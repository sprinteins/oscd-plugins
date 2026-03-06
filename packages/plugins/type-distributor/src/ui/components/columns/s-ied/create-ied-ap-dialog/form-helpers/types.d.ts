export type AccessPointData = {
	name: string
	description: string
}

export type IedData = {
	name: string
	description: string
	isNew: boolean
}

export type FieldErrors = {
	errors?: string[]
	properties?: {
		name?: { errors?: string[] }
		description?: { errors?: string[] }
	}
}

export type FormErrors = {
	errors?: string[]
	properties?: {
		ied?: FieldErrors
		ap?: {
			errors?: string[]
			items?: (FieldErrors | undefined)[]
		}
	}
}

export type AccessPointContext = {
	pendingNames: string[]
	existingNames: string[]
	iedName: string
}
