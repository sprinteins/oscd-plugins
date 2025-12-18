import type {
	ConnectionFilter,
	IEDInfo,
	IEDInfoWithBays,
	PublishedConnection,
	ReceivedConnection,
	ResolvedFilter
} from '@/headless/types'
import { MESSAGE_TYPE_TO_SCL_MAP } from './message-type-to-scl-map'

function normalizeMessageType(displayType: string): string {
	return MESSAGE_TYPE_TO_SCL_MAP[displayType] ?? displayType
}

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

function queryIEDsByPattern(
	xmlDocument: XMLDocument | null,
	pattern: string
): string[] {
	if (!xmlDocument) return []

	if (!pattern || pattern.trim() === '') {
		const allIEDs = xmlDocument.querySelectorAll('IED')
		return Array.from(allIEDs)
			.map((ied) => ied.getAttribute('name') || '')
			.filter((name) => name !== '')
	}

	try {
		let xpath: string

		if (pattern.startsWith('//')) {
			xpath = pattern
		} else if (pattern.includes('*')) {
			const cleanPattern = pattern.replace(/\*/g, '')
			if (cleanPattern) {
				xpath = `//default:IED[contains(@name,'${cleanPattern}')]`
			} else {
				xpath = '//default:IED'
			}
		} else {
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

function resolveFilter(
	filter: ConnectionFilter,
	xmlDocument: XMLDocument | null
): ResolvedFilter {
	const sourceIEDs = queryIEDsByPattern(xmlDocument, filter.sourceIEDPattern)
	const targetIEDs = queryIEDsByPattern(xmlDocument, filter.targetIEDPattern)

	const sourceMatchAll =
		!filter.sourceIEDPattern || filter.sourceIEDPattern.trim() === ''
	const targetMatchAll =
		!filter.targetIEDPattern || filter.targetIEDPattern.trim() === ''

	const normalizedType = normalizeMessageType(filter.messageType)

	return {
		sourceIEDs,
		targetIEDs,
		sourceMatchAll,
		targetMatchAll,
		messageType: normalizedType
	}
}

function determineVisibleIEDs(
	iedInfos: IEDInfo[],
	resolvedFilters: ResolvedFilter[]
): Set<string> {
	const visibleIEDs = new Set<string>()

	const hasMatchAllFilter = resolvedFilters.some(
		(filter) => filter.sourceMatchAll || filter.targetMatchAll
	)

	if (hasMatchAllFilter) {
		for (const ied of iedInfos) {
			visibleIEDs.add(ied.iedName)
		}
	} else {
		for (const filter of resolvedFilters) {
			for (const ied of filter.sourceIEDs) {
				visibleIEDs.add(ied)
			}
			for (const ied of filter.targetIEDs) {
				visibleIEDs.add(ied)
			}
		}
	}

	return visibleIEDs
}

function filterPublishedConnections(
	iedName: string,
	published: PublishedConnection[],
	resolvedFilters: ResolvedFilter[]
): PublishedConnection[] {
	return published.filter((pub) => {
		return resolvedFilters.some((filter) => {
			const sourceMatch =
				filter.sourceMatchAll || filter.sourceIEDs.includes(iedName)
			const targetMatch =
				filter.targetMatchAll ||
				filter.targetIEDs.includes(pub.targetIEDName)
			const typeMatch = pub.serviceType === filter.messageType

			return sourceMatch && targetMatch && typeMatch
		})
	})
}

function filterReceivedConnections(
	iedName: string,
	received: ReceivedConnection[],
	resolvedFilters: ResolvedFilter[]
): ReceivedConnection[] {
	return received.filter((rec) => {
		return resolvedFilters.some((filter) => {
			const sourceMatch =
				filter.sourceMatchAll || filter.sourceIEDs.includes(rec.iedName)
			const targetMatch =
				filter.targetMatchAll || filter.targetIEDs.includes(iedName)
			const typeMatch = rec.serviceType === filter.messageType

			return sourceMatch && targetMatch && typeMatch
		})
	})
}

function filterDetachedIEDs<T extends IEDInfo>(iedInfos: T[]): T[] {
	const ieds = iedInfos.filter(
		(ied) => ied.published.length > 0 || ied.received.length > 0
	)

	return ieds
}

function ensureReferencedIEDsIncluded<T extends IEDInfo>(
	filteredIEDs: T[],
	allIEDs: T[],
	resolvedFilters: ResolvedFilter[]
): T[] {
	const result = [...filteredIEDs]
	const includedIEDNames = new Set(result.map(ied => ied.iedName))
	const allIEDsMap = new Map(allIEDs.map(ied => [ied.iedName, ied]))
	
	const applyConnectionFiltersToIED = (ied: T): T => ({
		...ied,
		published: filterPublishedConnections(ied.iedName, ied.published, resolvedFilters),
		received: filterReceivedConnections(ied.iedName, ied.received, resolvedFilters)
	} as T)
	
	const addMissingIED = (iedName: string): boolean => {
		if (includedIEDNames.has(iedName)) return false
		
		const missingIED = allIEDsMap.get(iedName)
		if (!missingIED) return false
		
		result.push(applyConnectionFiltersToIED(missingIED))
		includedIEDNames.add(iedName)
		return true
	}
	
	const collectReferencedIEDNames = (ied: T): string[] => [
		...ied.published.map(pub => pub.targetIEDName),
		...ied.received.map(rec => rec.iedName)
	]
	
	let hasChanges = true
	while (hasChanges) {
		const currentSize = includedIEDNames.size
		
		const referencedNames = result.flatMap(collectReferencedIEDNames)
		referencedNames.forEach(addMissingIED)
		
		hasChanges = includedIEDNames.size > currentSize
	}
	
	return result
}

function shouldFilterDetachedIEDs(
	connectionFilters: ConnectionFilter[],
	resolvedFilters: ResolvedFilter[]
): boolean {
	if (connectionFilters.length === 0) {
		return false
	}
	// CHECKING WETHER ALL MESSAGE TYPE ARE SELECTeD IS NOt FEASIBLE SINCE USERS CAN ADD AND REMOVE MESSAGE, IN ADDITION TO DISABLING THEM
	const allMessageTypes = new Set(Object.values(MESSAGE_TYPE_TO_SCL_MAP))
	const selectedMessageTypes = new Set(
		resolvedFilters.map((filter) => filter.messageType)
	)
	const hasAllMessageTypes = Array.from(allMessageTypes).every((type) =>
		selectedMessageTypes.has(type)
	)
	return !hasAllMessageTypes
}

export function applyConnectionFilters<T extends IEDInfo>(
	iedInfos: T[],
	connectionFilters: ConnectionFilter[],
	xmlDocument: XMLDocument | null
): T[] {
	const resolvedFilters = connectionFilters.map((filter) =>
		resolveFilter(filter, xmlDocument)
	)

	const visibleIEDs = determineVisibleIEDs(iedInfos, resolvedFilters)

	let result = iedInfos
		.filter((ied) => visibleIEDs.has(ied.iedName))
		.map((ied) => ({
			...ied,
			published: filterPublishedConnections(
				ied.iedName,
				ied.published,
				resolvedFilters
			),
			received: filterReceivedConnections(
				ied.iedName,
				ied.received,
				resolvedFilters
			)
		}))

	if (shouldFilterDetachedIEDs(connectionFilters, resolvedFilters)) {
		result = filterDetachedIEDs(result)
		return ensureReferencedIEDsIncluded(result, iedInfos, resolvedFilters)
	} 
	return result
}

export function filterIEDsByBays<T extends IEDInfoWithBays>(
	iedInfos: T[],
	selectedBays: Set<string>
): T[] {
	if (selectedBays.size === 0) return iedInfos

	return iedInfos.filter((ied) => {
		if (!ied.bays || ied.bays.size === 0) return false
		return Array.from(ied.bays).some((bay: string) => selectedBays.has(bay))
	})
}
