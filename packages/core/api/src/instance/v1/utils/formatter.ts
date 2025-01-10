export function formatXml(xml: string, tab?: string) {
	let formatted = ''
	let indent = ''

	const indentChar = tab || '\t'

	for (const node of xml.split(/>\s*</)) {
		if (node.match(/^\/\w/)) indent = indent.substring(indentChar.length)
		formatted += `${indent}<${node}>\r\n`
		if (node.match(/^<?\w[^>]*[^/]$/)) indent += indentChar
	}

	return formatted.substring(1, formatted.length - 3)
}
