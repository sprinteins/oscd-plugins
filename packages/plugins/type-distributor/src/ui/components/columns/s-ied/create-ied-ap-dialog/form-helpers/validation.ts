import type { AccessPointData, FieldErrors, FormErrors, IedData } from './types'
import { queryAccessPointsFromIed } from '@/headless/scl'
import { createAccessPointSchema, createIedSchema } from './schemas'

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
	xmlDocument: XMLDocument | null | undefined
): FieldErrors | null {
	const schema = createIedSchema(xmlDocument)
	const result = schema.safeParse(ied)
	return flattenZodErrors(result)
}

type ValidateAccessPointContext = {
	pendingNames: string[]
	existingNames: string[]
	iedName: string
}

export function validateAccessPointFields(
	accessPointData: AccessPointData,
	context: ValidateAccessPointContext
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

	if (ied.isNew) {
		const iedErrors = validateIedFields(ied, xmlDocument)
		if (iedErrors) errors.ied = iedErrors
	} else {
		if (!ied.name.trim()) {
			errors.ied = { name: 'Please select an existing IED or create a new one' }
		}
	}

	const submittableAccessPoints = accessPoints.filter((ap) => ap.name.trim())

	if (!ied.isNew && submittableAccessPoints.length === 0) {
		errors.ap = { name: 'Access Point name is required when adding to existing IED' }
	} else if (submittableAccessPoints.length > 0) {
		const existingNames = ied.isNew
			? []
			: queryAccessPointsFromIed(xmlDocument, ied.name.trim())
		const pendingNames: string[] = []
		for (const ap of submittableAccessPoints) {
			const apErrors = validateAccessPointFields(ap, {
				pendingNames,
				existingNames,
				iedName: ied.name
			})
			if (apErrors && !errors.ap) errors.ap = apErrors
			pendingNames.push(ap.name.trim())
		}
	}

	return Object.keys(errors).length > 0 ? errors : null
}
