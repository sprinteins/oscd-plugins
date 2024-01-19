const iedPrefix = "ied-"

export function getIedNameFromId(iedId: string): string {
	return iedId.substring(iedPrefix.length)
}
