export type IedRenameData = {
	name: string
	description: string
}

export type AccessPointRenameData = {
	name: string
	description: string
}

export type RenameFieldErrors = {
	errors?: string[]
	properties?: {
		name?: { errors?: string[] }
		description?: { errors?: string[] }
	}
}

export type RenameFormErrors = {
	errors?: string[]
	properties?: {
		ied?: RenameFieldErrors
		ap?: RenameFieldErrors
	}
}
