export function getAccessPointsFromIED(
	xmlDocument: XMLDocument | null | undefined,
	iedName: string
): string[] {
	if (!xmlDocument) return []

	const accessPoints = Array.from(
		xmlDocument.querySelectorAll(`IED[name="${iedName}"] AccessPoint`)
	)
	return accessPoints
		.map((ap) => ap.getAttribute('name'))
		.filter((name): name is string => name !== null)
}

export function checkIedExists(
	xmlDocument: XMLDocument | null | undefined,
	iedName: string
): boolean {
	if (!xmlDocument) return false
	return xmlDocument.querySelector(`IED[name="${iedName}"]`) !== null
}

export type SingleModeFormState = {
	isMultiApMode: false
	isCreatingNewIed: boolean
	iedName: string
	existingSIedName: string
	accessPointName: string
	xmlDocument: XMLDocument | null | undefined
}

export type MultiApModeFormState = {
	isMultiApMode: true
	pendingAccessPointsCount: number
}

export type FormState = SingleModeFormState | MultiApModeFormState

export function validateForm(state: FormState): string | null {
	if (state.isMultiApMode) {
		if (state.pendingAccessPointsCount === 0) {
			return 'At least one Access Point is required'
		}
		return null
	}

	const { isCreatingNewIed, iedName, existingSIedName, accessPointName, xmlDocument } = state
	const trimmedIedName = iedName.trim()
	const trimmedApName = accessPointName.trim()
	const hasAccessPoint = trimmedApName.length > 0

	if (isCreatingNewIed && !trimmedIedName) {
		return 'IED name is required when creating a new IED'
	}

	if (isCreatingNewIed && trimmedIedName && checkIedExists(xmlDocument, trimmedIedName)) {
		return `IED "${trimmedIedName}" already exists`
	}

	if (!isCreatingNewIed && !existingSIedName) {
		return 'Please select an existing IED or create a new one'
	}

	if (!isCreatingNewIed && !hasAccessPoint) {
		return 'Access Point name is required when adding to existing IED'
	}

	if (hasAccessPoint && !isCreatingNewIed && existingSIedName) {
		const existingApNames = getAccessPointsFromIED(xmlDocument, existingSIedName)
		if (existingApNames.includes(trimmedApName)) {
			return `Access Point "${trimmedApName}" already exists in IED "${existingSIedName}"`
		}
	}

	return null
}

export function validateIedForMultiApMode(
	xmlDocument: XMLDocument | null | undefined,
	isCreatingNewIed: boolean,
	iedName: string
): string | null {
	if (!isCreatingNewIed) return null

	const trimmedName = iedName.trim()
	if (!trimmedName) {
		return 'IED name is required'
	}

	if (checkIedExists(xmlDocument, trimmedName)) {
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
