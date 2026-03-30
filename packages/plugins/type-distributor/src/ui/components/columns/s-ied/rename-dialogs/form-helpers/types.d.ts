import type { AccessPointData, FieldErrors } from '@/ui/components/columns/s-ied/create-ied-ap-dialog/form-helpers'

export type { AccessPointData, FieldErrors }

export type IedRenameData = {
	name: string
	description: string
}

export type RenameFormErrors = {
	errors?: string[]
	properties?: {
		ied?: FieldErrors
		ap?: FieldErrors
	}
}
