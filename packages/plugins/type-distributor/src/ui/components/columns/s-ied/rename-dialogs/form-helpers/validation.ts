import { z } from 'zod'
import {
	createRenameAccessPointSchema,
	createRenameCombinedSchema,
	createRenameIedSchema,
	getExistingApNamesExcludingCurrent
} from './schemas'
import type {
	AccessPointData,
	FieldErrors,
	IedRenameData,
	RenameFormErrors
} from './types'

type ValidateRenameIedFieldsParams = {
	ied: IedRenameData
	xmlDocument: XMLDocument | null | undefined
	currentIedName: string
}

export function validateRenameIedFields({
	ied,
	xmlDocument,
	currentIedName
}: ValidateRenameIedFieldsParams): FieldErrors | null {
	const result = createRenameIedSchema(
		xmlDocument,
		currentIedName
	).safeParse(ied)
	return result.success ? null : z.treeifyError(result.error)
}

type ValidateRenameAccessPointFieldsParams = {
	ap: AccessPointData
	xmlDocument: XMLDocument | null | undefined
	iedName: string
	currentApName: string
}

export function validateRenameAccessPointFields({
	ap,
	xmlDocument,
	iedName,
	currentApName
}: ValidateRenameAccessPointFieldsParams): FieldErrors | null {
	const existingApNames = getExistingApNamesExcludingCurrent({
		xmlDocument,
		iedName,
		currentApName
	})
	const result = createRenameAccessPointSchema({
		existingApNames,
		currentApName,
		iedName
	}).safeParse(ap)
	return result.success ? null : z.treeifyError(result.error)
}

type ValidateRenameCombinedParams = {
	ied: IedRenameData
	ap: AccessPointData
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
	const existingApNames = getExistingApNamesExcludingCurrent({
		xmlDocument,
		iedName: currentIedName,
		currentApName
	})
	const result = createRenameCombinedSchema({
		xmlDocument,
		currentIedName,
		currentApName,
		existingApNames
	}).safeParse({ ied, ap })
	return result.success ? null : z.treeifyError(result.error)
}
