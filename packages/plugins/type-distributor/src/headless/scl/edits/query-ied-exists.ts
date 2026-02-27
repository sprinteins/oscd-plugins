export function queryIedExists(
	xmlDocument: XMLDocument | null | undefined,
	iedName: string
): boolean {
	if (!xmlDocument) return false
	return xmlDocument.querySelector(`IED[name="${iedName}"]`) !== null
}
