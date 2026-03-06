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
	createFormSchema,
	createIedSchema
} from './schemas'

export function validateIedFields(
	ied: Pick<IedData, 'name' | 'description'>,
	xmlDocument: XMLDocument | null | undefined,
	isNew = true
): FieldErrors | null {
	const schema = createIedSchema(xmlDocument, isNew)
	const result = schema.safeParse(ied)
	return result.success ? null : result.error.format()
}

export function validateAccessPointFields(
	accessPointData: AccessPointData,
	context: AccessPointContext
): FieldErrors | null {
	const schema = createAccessPointSchema(context)
	const result = schema.safeParse(accessPointData)
	return result.success ? null : result.error.format()
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
	const existingNames = ied.isNew
		? []
		: queryAccessPointsFromIed(xmlDocument, ied.name.trim())

	const result = createFormSchema(
		xmlDocument,
		ied.isNew,
		existingNames,
		ied.name
	).safeParse({ ied, ap: accessPoints })

	if (result.success) return null

	const fmt = result.error.format()
	const apFmt = fmt.ap
	return {
		ied: fmt.ied,
		ap: apFmt ? (apFmt[0] ?? { _errors: apFmt._errors }) : undefined
	}
}
