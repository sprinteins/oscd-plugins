import type { ConnectionFilter, ResolvedFilter } from '@/headless/types'
import { MESSAGE_TYPE_TO_SCL_MAP } from './message-type-to-scl-map'

export function shouldRemoveDetachedIEDs(
	connectionFilters: ConnectionFilter[],
	resolvedFilters: ResolvedFilter[]
): boolean {
	if (connectionFilters.length === 0) {
		return false
	}

	return !areAllMessageTypesSelected(resolvedFilters)
}



function areAllMessageTypesSelected(resolvedFilters: ResolvedFilter[]): boolean {
	const allMessageTypes = new Set(Object.values(MESSAGE_TYPE_TO_SCL_MAP))
	const selectedMessageTypes = new Set(
		resolvedFilters.map((filter) => filter.messageType)
	)

	return Array.from(allMessageTypes).every((type) =>
		selectedMessageTypes.has(type)
	)
}
