export function serializeXmlDocument(doc: XMLDocument): string {
	const serializer = new XMLSerializer()
	const xmlString = serializer.serializeToString(doc)
	const xmlStringRoot = '<?xml version="1.0" encoding="UTF-8"?>'
	return xmlString.startsWith('<?xml')
		? xmlString
		: // biome-ignore lint/style/useTemplate: using templates literal would make the code less readable
			xmlStringRoot + '\n' + xmlString
}
