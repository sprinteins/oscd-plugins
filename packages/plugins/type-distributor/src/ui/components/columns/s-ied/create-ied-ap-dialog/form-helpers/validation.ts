import type {
	AccessPointContext,
	AccessPointData,
	FieldErrors,
	FormErrors,
	IedData
} from './types'
import { queryAccessPointsFromIed } from '@/headless/scl'
import {
	createAccessPointSchema,
	createAccessPointsCollectionSchema,
	createIedSchema
} from './schemas'

function flattenZodErrors(
	result: ReturnType<ReturnType<typeof createIedSchema>['safeParse']>
): FieldErrors | null {
	if (result.success) return null
	const flat = result.error.flatten().fieldErrors
	const errors: FieldErrors = {}
	if (flat.name?.[0]) errors.name = flat.name[0]
	if (flat.description?.[0]) errors.description = flat.description[0]
	return Object.keys(errors).length > 0 ? errors : null
}

export function validateIedFields(
	ied: Pick<IedData, 'name' | 'description'>,
	xmlDocument: XMLDocument | null | undefined,
	isNew = true
): FieldErrors | null {
	const schema = createIedSchema(xmlDocument, isNew)
	const result = schema.safeParse(ied)
	return flattenZodErrors(result)
}

export function validateAccessPointFields(
	accessPointData: AccessPointData,
	context: AccessPointContext
): FieldErrors | null {
	const schema = createAccessPointSchema(context)
	const result = schema.safeParse(accessPointData)
	return flattenZodErrors(result)
}

type ValidateSubmissionParams = {
	ied: IedData
	accessPoints: AccessPointData[]
	xmlDocument: XMLDocument | null | undefined
}

export function validateSubmission({
	ied,
	accessPoints,
	xmlDocument
}: ValidateSubmissionParams): FormErrors | null {
	const errors: FormErrors = {}

	const iedErrors = validateIedFields(ied, xmlDocument, ied.isNew)
	if (iedErrors) errors.ied = iedErrors

	const existingNames = ied.isNew
		? []
		: queryAccessPointsFromIed(xmlDocument, ied.name.trim())

	const apSchema = createAccessPointsCollectionSchema({
		isNew: ied.isNew,
		existingNames,
		iedName: ied.name
	})
	const apResult = apSchema.safeParse(accessPoints)
	if (!apResult.success) {
		const message = apResult.error.errors[0]?.message
		if (message) errors.ap = { name: message }
	}

	return Object.keys(errors).length > 0 ? errors : null
}
