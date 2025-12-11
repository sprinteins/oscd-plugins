export interface ConnectionFilter {
	sourceIEDPattern: string
	targetIEDPattern: string
	messageType: string
}

/**
 * Maps SCL message type values to display constants.
 * This matches the mapping used in node-layout-connections.ts
 */
const MESSAGE_TYPE_TO_SCL_MAP: Record<string, string> = {
	'GOOSE': 'GOOSE',
	'MMS': 'MMS',
	'SampledValues': 'SMV',
	'Unknown': ''  // Empty string in SCL data
}

/**
 * Normalizes a message type from display format to SCL format.
 */
function normalizeMessageType(displayType: string): string {
	return MESSAGE_TYPE_TO_SCL_MAP[displayType] ?? displayType
}

/**
 * Creates a namespace resolver for XPath queries on SCL XML documents.
 */
function createNamespaceResolver(
	xmlDocument: XMLDocument
): (prefix: string | null) => string | null {
	const namespaces: { [key: string]: string } = {}
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

/**
 * Query IEDs from an SCL XML document using a flexible pattern.
 */
function queryIEDsByPattern(
	xmlDocument: XMLDocument | null,
	pattern: string
): string[] {
	if (!xmlDocument) return []

	// Empty pattern returns all IEDs
	if (!pattern || pattern.trim() === '') {
		const allIEDs = xmlDocument.querySelectorAll('IED')
		return Array.from(allIEDs)
			.map((ied) => ied.getAttribute('name') || '')
			.filter((name) => name !== '')
	}

	try {
		let xpath: string

		// Use pattern as-is if it's already an XPath expression
		if (pattern.startsWith('//')) {
			xpath = pattern
		}
		// Handle wildcard patterns
		else if (pattern.includes('*')) {
			const cleanPattern = pattern.replace(/\*/g, '')
			if (cleanPattern) {
				xpath = `//default:IED[contains(@name,'${cleanPattern}')]`
			} else {
				xpath = '//default:IED'
			}
		}
		// Handle exact name match
		else {
			xpath = `//default:IED[@name='${pattern}']`
		}

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
	} catch (e) {
		console.warn(`Invalid IED XPath pattern: ${pattern}`, e)
		return []
	}
}

export function applyConnectionFilters<
	T extends {
		iedName: string
		published: Array<{ targetIEDName: string; serviceType: string }>
		received: Array<{ iedName: string; serviceType: string }>
	}
>(
	iedInfos: T[],
	connectionFilters: ConnectionFilter[],
	xmlDocument: XMLDocument | null
): T[] {
	console.log('[applyConnectionFilters] Input filters:', connectionFilters)
	console.log('[applyConnectionFilters] Input IED count:', iedInfos.length)

	// Log all available message types in the data
	const allMessageTypes = new Set<string>()
	for (const ied of iedInfos) {
		for (const pub of ied.published) {
			allMessageTypes.add(pub.serviceType)
		}
		for (const rec of ied.received) {
			allMessageTypes.add(rec.serviceType)
		}
	}
	console.log(
		'[applyConnectionFilters] Available message types in data:',
		Array.from(allMessageTypes)
	)

	// Resolve patterns to IED names for each filter
	const resolvedFilters = connectionFilters.map((filter) => {
		const sourceIEDs = queryIEDsByPattern(
			xmlDocument,
			filter.sourceIEDPattern
		)
		const targetIEDs = queryIEDsByPattern(
			xmlDocument,
			filter.targetIEDPattern
		)

		// Track if patterns were empty (meaning match all)
		const sourceMatchAll =
			!filter.sourceIEDPattern || filter.sourceIEDPattern.trim() === ''
		const targetMatchAll =
			!filter.targetIEDPattern || filter.targetIEDPattern.trim() === ''

		// Normalize message type from display format to SCL format
		const normalizedType = normalizeMessageType(filter.messageType)

		console.log(
			`[Filter Resolution] Type: ${filter.messageType} → ${normalizedType} | ` +
				`Source: "${filter.sourceIEDPattern}" → ${sourceIEDs.length} IEDs (matchAll: ${sourceMatchAll}) | ` +
				`Target: "${filter.targetIEDPattern}" → ${targetIEDs.length} IEDs (matchAll: ${targetMatchAll})`
		)

		return {
			sourceIEDs,
			targetIEDs,
			sourceMatchAll,
			targetMatchAll,
			messageType: normalizedType
		}
	})

	// Collect all IEDs that should be visible based on filters
	const visibleIEDs = new Set<string>()

	// Check if any filter has empty patterns (meaning match all)
	const hasMatchAllFilter = resolvedFilters.some(
		(filter) => filter.sourceMatchAll || filter.targetMatchAll
	)

	// If there's a match-all filter, start with all IEDs
	if (hasMatchAllFilter) {
		for (const ied of iedInfos) {
			visibleIEDs.add(ied.iedName)
		}
	} else {
		// Otherwise, only add IEDs explicitly mentioned in filters
		for (const filter of resolvedFilters) {
			for (const ied of filter.sourceIEDs) {
				visibleIEDs.add(ied)
			}
			for (const ied of filter.targetIEDs) {
				visibleIEDs.add(ied)
			}
		}
	}

	// Filter IEDs and their connections
	const result = iedInfos
		.filter((ied) => visibleIEDs.has(ied.iedName))
		.map((ied) => {
			const filteredPublished = ied.published.filter((pub) => {
				return resolvedFilters.some((filter) => {
					const sourceMatch =
						filter.sourceMatchAll ||
						filter.sourceIEDs.includes(ied.iedName)
					const targetMatch =
						filter.targetMatchAll ||
						filter.targetIEDs.includes(pub.targetIEDName)
					const typeMatch = pub.serviceType === filter.messageType
					
					return sourceMatch && targetMatch && typeMatch
				})
			})

			const filteredReceived = ied.received.filter((rec) => {
				return resolvedFilters.some((filter) => {
					const sourceMatch =
						filter.sourceMatchAll ||
						filter.sourceIEDs.includes(rec.iedName)
					const targetMatch =
						filter.targetMatchAll ||
						filter.targetIEDs.includes(ied.iedName)
					const typeMatch = rec.serviceType === filter.messageType
					
					return sourceMatch && targetMatch && typeMatch
				})
			})

			return {
				...ied,
				published: filteredPublished,
				received: filteredReceived
			}
		})

	console.log('[applyConnectionFilters] Result:', result.length, 'IEDs with filtered connections')
	return result
}

export function filterIEDsByBays<
	T extends {
		bays?: Set<string>
	}
>(iedInfos: T[], selectedBays: Set<string>): T[] {
	if (selectedBays.size === 0) return iedInfos

	return iedInfos.filter((ied) => {
		if (!ied.bays || ied.bays.size === 0) return false
		return Array.from(ied.bays).some((bay: string) => selectedBays.has(bay))
	})
}
