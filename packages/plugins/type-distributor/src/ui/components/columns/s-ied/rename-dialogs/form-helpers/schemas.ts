import { z } from 'zod'
import { iedNameBaseSchema } from '@/ui/components/columns/s-ied/create-ied-ap-dialog/form-helpers'
import { queryIedExists, queryAccessPointsFromIed } from '@/headless/scl'

export function createRenameIedSchema(
	xmlDocument: XMLDocument | null | undefined,
	currentIedName: string
) {
	return z
		.object({
			name: iedNameBaseSchema.pipe(
				z.string().min(1, 'IED name is required')
			),
			description: z.string().trim()
		})
		.superRefine((ied, ctx) => {
			const trimmedName = ied.name.trim()
			if (!trimmedName) return
			if (trimmedName === currentIedName) return

			if (queryIedExists(xmlDocument, CSS.escape(trimmedName))) {
				ctx.addIssue({
					code: 'custom',
					message: `IED "${trimmedName}" already exists`,
					path: ['name']
				})
			}
		})
}

type CreateRenameAccessPointSchemaParams = {
	existingApNames: string[]
	currentApName: string
	iedName: string
}

export function createRenameAccessPointSchema({
	existingApNames,
	currentApName,
	iedName
}: CreateRenameAccessPointSchemaParams) {
	return z
		.object({
			name: z.string().trim().min(1, 'Access Point name is required'),
			description: z.string().trim()
		})
		.superRefine((ap, ctx) => {
			const trimmedName = ap.name.trim()
			if (!trimmedName) return
			if (trimmedName === currentApName) return

			if (existingApNames.includes(trimmedName)) {
				ctx.addIssue({
					code: 'custom',
					message: `Access Point "${trimmedName}" already exists in IED "${iedName}"`,
					path: ['name']
				})
			}
		})
}

type CreateRenameCombinedSchemaParams = {
	xmlDocument: XMLDocument | null | undefined
	currentIedName: string
	currentApName: string
	existingApNames: string[]
}

export function createRenameCombinedSchema({
	xmlDocument,
	currentIedName,
	currentApName,
	existingApNames
}: CreateRenameCombinedSchemaParams) {
	return z.object({
		ied: createRenameIedSchema(xmlDocument, currentIedName),
		ap: createRenameAccessPointSchema({
			existingApNames,
			currentApName,
			iedName: currentIedName
		})
	})
}

type GetExistingApNamesExcludingCurrentParams = {
	xmlDocument: XMLDocument | null | undefined
	iedName: string
	currentApName: string
}

export function getExistingApNamesExcludingCurrent({
	xmlDocument,
	iedName,
	currentApName
}: GetExistingApNamesExcludingCurrentParams): string[] {
	return queryAccessPointsFromIed(xmlDocument, iedName).filter(
		(name) => name !== currentApName
	)
}
