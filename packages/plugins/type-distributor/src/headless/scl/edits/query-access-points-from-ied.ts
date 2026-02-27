export function queryAccessPointsFromIed(
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
