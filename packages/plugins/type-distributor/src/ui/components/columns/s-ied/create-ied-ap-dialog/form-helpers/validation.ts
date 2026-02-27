import type { AccessPointData, IedData } from './types'
import { queryAccessPointsFromIed, queryIedExists } from '@/headless/scl'

type ValidateSubmissionParams = {
	ied: IedData
	accessPoints: AccessPointData[]
	xmlDocument: XMLDocument | null | undefined
}

export function validateSubmission({
	ied,
	accessPoints,
	xmlDocument
}: ValidateSubmissionParams): string | null {
	const trimmedIedName = ied.name.trim()

	if (ied.isNew) {
		if (!trimmedIedName) {
			return 'IED name is required when creating a new IED'
		}
		if (queryIedExists(xmlDocument, trimmedIedName)) {
			return `IED "${trimmedIedName}" already exists`
		}
	} else {
		if (!trimmedIedName) {
			return 'Please select an existing IED or create a new one'
		}
		if (accessPoints.length === 0) {
			return 'Access Point name is required when adding to existing IED'
		}
		const existingApNames = queryAccessPointsFromIed(
			xmlDocument,
			trimmedIedName
		)
		for (const ap of accessPoints) {
			if (existingApNames.includes(ap.name)) {
				return `Access Point "${ap.name}" already exists in IED "${trimmedIedName}"`
			}
		}
	}

	return null
}

export function validateIedBeforeMultiAp(
	xmlDocument: XMLDocument | null | undefined,
	ied: IedData
): string | null {
	if (!ied.isNew) return null

	const trimmedName = ied.name.trim()
	if (!trimmedName) {
		return 'IED name is required'
	}
	if (queryIedExists(xmlDocument, trimmedName)) {
		return `IED "${trimmedName}" already exists`
	}

	return null
}

type ValidateAccessPointParams = {
	apName: string
	pendingApNames: string[]
	existingApNames: string[]
	iedName: string
}

export function validateAccessPoint({
	apName,
	pendingApNames,
	existingApNames,
	iedName
}: ValidateAccessPointParams): string | null {
	const trimmedName = apName.trim()

	if (!trimmedName) {
		return 'Access Point name is required'
	}
	if (pendingApNames.includes(trimmedName)) {
		return `Access Point "${trimmedName}" is already in the list`
	}
	if (existingApNames.includes(trimmedName)) {
		return `Access Point "${trimmedName}" already exists in IED "${iedName}"`
	}

	return null
}
