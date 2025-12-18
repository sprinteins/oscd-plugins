import type { ConnectionFilter, IEDInfo, ResolvedFilter } from '@/headless/types'
import { resolveConnectionFilter } from './filters/resolve-filter'
import {
	determineVisibleIEDs,
	removeDetachedIEDs,
	ensureReferencedIEDsIncluded
} from './filters/ied-filters'
import {
	filterPublishedConnections,
	filterReceivedConnections
} from './filters/connection-filters'
import { shouldRemoveDetachedIEDs } from './should-remove-detached-ieds'

export function applyConnectionFilters<T extends IEDInfo>(
	iedInfos: T[],
	connectionFilters: ConnectionFilter[],
	xmlDocument: XMLDocument | null
): T[] {
	const resolvedFilters = connectionFilters.map((filter) =>
		resolveConnectionFilter(filter, xmlDocument)
	)

	const visibleIEDs = determineVisibleIEDs(iedInfos, resolvedFilters)

	let result = applyFiltersToVisibleIEDs(iedInfos, visibleIEDs, resolvedFilters)

	if (shouldRemoveDetachedIEDs(connectionFilters, resolvedFilters)) {
		result = removeDetachedIEDs(result)
		return ensureReferencedIEDsIncluded(result, iedInfos, resolvedFilters)
	}

	return result
}

function applyFiltersToVisibleIEDs<T extends IEDInfo>(
	iedInfos: T[],
	visibleIEDs: Set<string>,
	resolvedFilters: ResolvedFilter[]
): T[] {
	return iedInfos
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
}
