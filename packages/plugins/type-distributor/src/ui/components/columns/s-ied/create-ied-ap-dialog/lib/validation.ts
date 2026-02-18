import type { AccessPointData, IedData } from './types'

export function getAccessPointsFromIED(
	xmlDocument: XMLDocument | null | undefined,
	ied: IedData
): string[] {
	if (!xmlDocument) return []

	const accessPoints = Array.from(
		xmlDocument.querySelectorAll(
			`IED[name="${ied.name.trim()}"] AccessPoint`
		)
	)
	return accessPoints
		.map((ap) => ap.getAttribute('name'))
		.filter((name): name is string => name !== null)
}

export function hasIed(
	xmlDocument: XMLDocument | null | undefined,
	ied: IedData
): boolean {
	if (!xmlDocument) return false
	return xmlDocument.querySelector(`IED[name="${ied.name.trim()}"]`) !== null
}

export type SubmitValidationParams = {
	ied: IedData
	accessPoints: AccessPointData[]
	xmlDocument: XMLDocument | null | undefined
}

export function validateSubmission(
	params: SubmitValidationParams
): string | null {
	const { ied, accessPoints, xmlDocument } = params
	const trimmedIedName = ied.name.trim()

	if (ied.isNew) {
		if (!trimmedIedName) {
			return 'IED name is required when creating a new IED'
		}
		if (hasIed(xmlDocument, ied)) {
			return `IED "${trimmedIedName}" already exists`
		}
	} else {
		if (!trimmedIedName) {
			return 'Please select an existing IED or create a new one'
		}
	}

	if (accessPoints.length === 0) {
		return 'At least one Access Point is required'
	}

	if (!ied.isNew) {
		const existingApNames = getAccessPointsFromIED(xmlDocument, ied)
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

	if (hasIed(xmlDocument, ied)) {
		return `IED "${trimmedName}" already exists`
	}

	return null
}

export function validateAccessPoint(
	apName: string,
	pendingApNames: string[],
	existingApNames: string[],
	iedName: string
): string | null {
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
