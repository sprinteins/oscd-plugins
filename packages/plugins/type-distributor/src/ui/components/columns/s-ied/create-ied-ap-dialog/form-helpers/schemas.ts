import { z } from 'zod'
import { queryIedExists } from '@/headless/scl'
import type { AccessPointContext } from './types'

export const accessPointBaseSchema = z.object({
	name: z.string().trim().min(1, 'Access Point name is required'),
	description: z.string().trim()
})

const iedNameBaseSchema = z
	.string()
	.trim()
	.max(64, 'IED name cannot exceed 64 characters')
	.regex(
		/^[a-zA-Z0-9_]+$/,
		'IED name can only contain alphanumeric characters and underscores'
	)

export const iedBaseSchema = z.object({
	name: iedNameBaseSchema.pipe(z.string().min(1, 'IED name is required')),
	description: z.string().trim()
})

function addAccessPointNameIssues(
	trimmedName: string,
	{ pendingNames, existingNames, iedName }: AccessPointContext,
	addIssue: (msg: string) => void
) {
	if (pendingNames.includes(trimmedName)) {
		addIssue(`Access Point "${trimmedName}" is already in the list`)
	}
	if (existingNames.includes(trimmedName)) {
		addIssue(
			`Access Point "${trimmedName}" already exists in IED "${iedName}"`
		)
	}
}

type AccessPointsCollectionContext = {
	isNew: boolean
	existingNames: string[]
	iedName: string
}

export function createAccessPointsCollectionSchema({
	isNew,
	existingNames,
	iedName
}: AccessPointsCollectionContext) {
	return z.array(z.object({ name: z.string() })).superRefine((aps, ctx) => {
		const submittable = aps.filter((ap) => ap.name.trim())

		if (!isNew && submittable.length === 0) {
			ctx.addIssue({
				code: 'custom',
				message:
					'Access Point name is required when adding to existing IED'
			})
			return
		}

		const pendingNames: string[] = []
		for (let i = 0; i < aps.length; i++) {
			const trimmedName = aps[i].name.trim()
			if (!trimmedName) continue

			addAccessPointNameIssues(
				trimmedName,
				{ pendingNames, existingNames, iedName },
				(msg) =>
					ctx.addIssue({
						code: 'custom',
						message: msg,
						path: [i, 'name']
					})
			)

			pendingNames.push(trimmedName)
		}
	})
}

export function createAccessPointSchema(context: AccessPointContext) {
	return accessPointBaseSchema.superRefine((ap, ctx) => {
		const trimmedName = ap.name.trim()
		if (!trimmedName) return

		addAccessPointNameIssues(trimmedName, context, (msg) =>
			ctx.addIssue({
				code: 'custom',
				message: msg,
				path: ['name']
			})
		)
	})
}

export function createFormSchema(
	xmlDocument: XMLDocument | null | undefined,
	isNew: boolean,
	existingNames: string[],
	iedName: string
) {
	return z.object({
		ied: createIedSchema(xmlDocument, isNew),
		ap: createAccessPointsCollectionSchema({
			isNew,
			existingNames,
			iedName
		})
	})
}

export function createIedSchema(
	xmlDocument: XMLDocument | null | undefined,
	isNew = true
) {
	const nameValidation = iedNameBaseSchema.pipe(
		isNew
			? z.string().min(1, 'IED name is required')
			: z.string().min(1, 'Please select an existing IED or create a new one')
	)

	return z
		.object({
			name: nameValidation,
			description: z.string().trim()
		})
		.superRefine((ied, ctx) => {
			if (!isNew) return

			const trimmedName = ied.name.trim()
			if (!trimmedName) return

			if (queryIedExists(xmlDocument, trimmedName)) {
				ctx.addIssue({
					code: 'custom',
					message: `IED "${trimmedName}" already exists`,
					path: ['name']
				})
			}
		})
}
