import type { IEDInfo, ResolvedFilter } from '@/headless/types'
import {
	filterPublishedConnections,
	filterReceivedConnections
} from './connection-filters'

export function determineVisibleIEDs(
	iedInfos: IEDInfo[],
	resolvedFilters: ResolvedFilter[]
): Set<string> {
	const hasMatchAllFilter = resolvedFilters.some(
		(filter) => filter.sourceMatchAll || filter.targetMatchAll
	)

	if (hasMatchAllFilter) {
		return new Set(iedInfos.map((ied) => ied.iedName))
	}

	return collectFilteredIEDNames(resolvedFilters)
}

export function removeDetachedIEDs<T extends IEDInfo>(iedInfos: T[]): T[] {
	return iedInfos.filter(hasAnyConnections)
}

export function ensureReferencedIEDsIncluded<T extends IEDInfo>(
	filteredIEDs: T[],
	allIEDs: T[],
	resolvedFilters: ResolvedFilter[]
): T[] {
	const result = [...filteredIEDs]
	const includedIEDNames = new Set(result.map((ied) => ied.iedName))
	const allIEDsMap = new Map(allIEDs.map((ied) => [ied.iedName, ied]))

	const applyFiltersToIED = (ied: T): T =>
		({
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
		}) as T

	const addMissingIED = (iedName: string): boolean => {
		if (includedIEDNames.has(iedName)) return false

		const missingIED = allIEDsMap.get(iedName)
		if (!missingIED) return false

		result.push(applyFiltersToIED(missingIED))
		includedIEDNames.add(iedName)
		return true
	}

	const collectReferencedIEDNames = (ied: T): string[] => [
		...ied.published.map((pub) => pub.targetIEDName),
		...ied.received.map((rec) => rec.iedName)
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

function collectFilteredIEDNames(
	resolvedFilters: ResolvedFilter[]
): Set<string> {
	const visibleIEDs = new Set<string>()

	for (const filter of resolvedFilters) {
		for (const ied of filter.sourceIEDs) {
			visibleIEDs.add(ied)
		}
		for (const ied of filter.targetIEDs) {
			visibleIEDs.add(ied)
		}
	}

	return visibleIEDs
}

function hasAnyConnections(ied: IEDInfo): boolean {
	return ied.published.length > 0 || ied.received.length > 0
}
