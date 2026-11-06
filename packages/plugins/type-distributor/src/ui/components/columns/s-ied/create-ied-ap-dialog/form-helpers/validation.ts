import { z } from 'zod'
import { queryAccessPointsFromIed } from '@/headless/scl'
import {
	createAccessPointSchema,
	createFormSchema,
	createIedSchema
} from './schemas'
import { validateServerAtTargets } from './server-at-validation'
import type {
	AccessPointContext,
	AccessPointData,
	FieldErrors,
	FormErrors,
	IedData
} from './types'

export function validateIedFields(
	ied: Pick<IedData, 'name' | 'description'>,
	xmlDocument: XMLDocument | null | undefined,
	isNew = true
): FieldErrors | null {
	const result = createIedSchema(xmlDocument, isNew).safeParse(ied)
	return result.success ? null : z.treeifyError(result.error)
}

export function validateAccessPointFields(
	accessPointData: AccessPointData,
	context: AccessPointContext
): FieldErrors | null {
	const result = createAccessPointSchema(context).safeParse(accessPointData)
	return result.success ? null : z.treeifyError(result.error)
}

type ValidateSubmissionParams = {
	ied: IedData
	accessPoints: AccessPointData[]
	xmlDocument: XMLDocument | null | undefined
	ssdDocument: XMLDocument | null | undefined
}

export function validateSubmission({
	ied,
	accessPoints,
	xmlDocument,
	ssdDocument
}: ValidateSubmissionParams) {
	const serverAtErrors = validateServerAtTargets(
		ied,
		accessPoints,
		xmlDocument
	)

	const existingNames = ied.isNew
		? []
		: queryAccessPointsFromIed(xmlDocument, ied.name.trim())

	const result = createFormSchema({
		xmlDocument,
		ssdDocument,
		isNew: ied.isNew,
		existingNames,
		iedName: ied.name
	}).safeParse({ ied, ap: accessPoints })

	if (result.success && serverAtErrors.length === 0) return null

	const errors: FormErrors = result.success
		? {}
		: z.treeifyError(result.error)
	return serverAtErrors.length > 0
		? { ...errors, errors: [...(errors.errors ?? []), ...serverAtErrors] }
		: errors
}
