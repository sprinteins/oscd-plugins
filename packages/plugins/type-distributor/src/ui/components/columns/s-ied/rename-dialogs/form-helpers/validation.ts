import { z } from 'zod'
import {
	createRenameAccessPointSchema,
	createRenameCombinedSchema,
	createRenameIedSchema,
	getExistingApNamesExcludingCurrent
} from './schemas'
import type {
	AccessPointRenameData,
	IedRenameData,
	RenameFieldErrors,
	RenameFormErrors
} from './types'

export function validateRenameIedFields(
	ied: IedRenameData,
	xmlDocument: XMLDocument | null | undefined,
	currentIedName: string
): RenameFieldErrors | null {
	const result = createRenameIedSchema(
		xmlDocument,
		currentIedName
	).safeParse(ied)
	return result.success ? null : z.treeifyError(result.error)
}

export function validateRenameAccessPointFields(
	ap: AccessPointRenameData,
	xmlDocument: XMLDocument | null | undefined,
	iedName: string,
	currentApName: string
): RenameFieldErrors | null {
	const existingApNames = getExistingApNamesExcludingCurrent(
		xmlDocument,
		iedName,
		currentApName
	)
	const result = createRenameAccessPointSchema(
		existingApNames,
		currentApName,
		iedName
	).safeParse(ap)
	return result.success ? null : z.treeifyError(result.error)
}

type ValidateRenameCombinedParams = {
	ied: IedRenameData
	ap: AccessPointRenameData
	xmlDocument: XMLDocument | null | undefined
	currentIedName: string
	currentApName: string
}

export function validateRenameCombinedForm({
	ied,
	ap,
	xmlDocument,
	currentIedName,
	currentApName
}: ValidateRenameCombinedParams): RenameFormErrors | null {
	const existingApNames = getExistingApNamesExcludingCurrent(
		xmlDocument,
		currentIedName,
		currentApName
	)
	const result = createRenameCombinedSchema(
		xmlDocument,
		currentIedName,
		currentApName,
		existingApNames
	).safeParse({ ied, ap })
	return result.success ? null : z.treeifyError(result.error)
}
