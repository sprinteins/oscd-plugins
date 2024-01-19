const shortUuidDigits = 6

export function createCableId(label: string): string {
	return `${crypto.randomUUID().substring(0, shortUuidDigits)}-${label}`
}

export function extractCableNameFromId(cableName: string): string {
	return cableName.substring(shortUuidDigits + 1)
}
