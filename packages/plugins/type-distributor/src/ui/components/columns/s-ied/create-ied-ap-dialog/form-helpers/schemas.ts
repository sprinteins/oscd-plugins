import { z } from 'zod'
import { queryIedExists } from '@/headless/scl'

export const accessPointBaseSchema = z.object({
	name: z.string().trim().min(1, 'Access Point name is required'),
	description: z.string().trim()
})

export const iedBaseSchema = z.object({
	name: z.string().trim().min(1, 'IED name is required'),
	description: z.string().trim()
})

type AccessPointValidationContext = {
	pendingNames: string[]
	existingNames: string[]
	iedName: string
}

export function createAccessPointSchema({
	pendingNames,
	existingNames,
	iedName
}: AccessPointValidationContext) {
	return accessPointBaseSchema.superRefine((ap, ctx) => {
		const trimmedName = ap.name.trim()
		if (!trimmedName) return

		if (pendingNames.includes(trimmedName)) {
			ctx.addIssue({
				code: z.ZodIssueCode.custom,
				message: `Access Point "${trimmedName}" is already in the list`,
				path: ['name']
			})
		}

		if (existingNames.includes(trimmedName)) {
			ctx.addIssue({
				code: z.ZodIssueCode.custom,
				message: `Access Point "${trimmedName}" already exists in IED "${iedName}"`,
				path: ['name']
			})
		}
	})
}

export function createIedSchema(xmlDocument: XMLDocument | null | undefined) {
	return iedBaseSchema.superRefine((ied, ctx) => {
		const trimmedName = ied.name.trim()
		if (!trimmedName) return

		if (queryIedExists(xmlDocument, trimmedName)) {
			ctx.addIssue({
				code: z.ZodIssueCode.custom,
				message: `IED "${trimmedName}" already exists`,
				path: ['name']
			})
		}
	})
}
