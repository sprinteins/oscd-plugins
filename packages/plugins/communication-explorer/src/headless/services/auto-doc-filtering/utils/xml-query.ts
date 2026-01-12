export function createNamespaceResolver(
	xmlDocument: XMLDocument
): (prefix: string | null) => string | null {
	const namespaces: Record<string, string> = {}
	const attributes = xmlDocument.documentElement.attributes

	for (let i = 0; i < attributes.length; i++) {
		const attr = attributes[i]
		if (attr.name.startsWith('xmlns:')) {
			const prefix = attr.name.split(':')[1]
			namespaces[prefix] = attr.value
		} else if (attr.name === 'xmlns') {
			namespaces.default = attr.value
		}
	}

	return (prefix: string | null): string | null => {
		if (prefix === null) return null
		return namespaces[prefix] || namespaces.default || null
	}
}

export function queryIEDsByPattern(
	xmlDocument: XMLDocument | null,
	pattern: string
): string[] {
	if (!xmlDocument) return []

	if (!pattern || pattern.trim() === '') {
		return getAllIEDNames(xmlDocument)
	}

	try {
		const xpath = buildXPathExpression(pattern)
		return executeXPathQuery(xmlDocument, xpath)
	} catch (e) {
		console.warn(`Invalid IED XPath pattern: ${pattern}`, e)
		return []
	}
}

function getAllIEDNames(xmlDocument: XMLDocument): string[] {
	const allIEDs = xmlDocument.querySelectorAll('IED')
	return Array.from(allIEDs)
		.map((ied) => ied.getAttribute('name') || '')
		.filter((name) => name !== '')
}

function buildXPathExpression(pattern: string): string {
	if (pattern.startsWith('//')) {
		return pattern
	}
	
	if (pattern.includes('*')) {
		const cleanPattern = pattern.replace(/\*/g, '')
		return cleanPattern
			? `//default:IED[contains(@name,'${cleanPattern}')]`
			: '//default:IED'
	}
	
	return `//default:IED[@name='${pattern}']`
}

function executeXPathQuery(xmlDocument: XMLDocument, xpath: string): string[] {
	const namespaceResolver = createNamespaceResolver(xmlDocument)
	const result = xmlDocument.evaluate(
		xpath,
		xmlDocument,
		namespaceResolver,
		XPathResult.ORDERED_NODE_ITERATOR_TYPE,
		null
	)

	const matchedIEDs: string[] = []
	let node = result.iterateNext()
	while (node) {
		const name = (node as Element).getAttribute('name')
		if (name) matchedIEDs.push(name)
		node = result.iterateNext()
	}

	return matchedIEDs
}
