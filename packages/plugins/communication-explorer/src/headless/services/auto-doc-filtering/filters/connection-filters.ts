import type {
	PublishedConnection,
	ReceivedConnection,
	ResolvedFilter
} from '@/headless/types'

export function filterPublishedConnections(
	iedName: string,
	published: PublishedConnection[],
	resolvedFilters: ResolvedFilter[]
): PublishedConnection[] {
	return published.filter((connection) =>
		isPublishedConnectionAllowed(iedName, connection, resolvedFilters)
	)
}

export function filterReceivedConnections(
	iedName: string,
	received: ReceivedConnection[],
	resolvedFilters: ResolvedFilter[]
): ReceivedConnection[] {
	return received.filter((connection) =>
		isReceivedConnectionAllowed(iedName, connection, resolvedFilters)
	)
}

function isPublishedConnectionAllowed(
	iedName: string,
	connection: PublishedConnection,
	resolvedFilters: ResolvedFilter[]
): boolean {
	return resolvedFilters.some((filter) => {
		const sourceMatch =
			filter.sourceMatchAll || filter.sourceIEDs.includes(iedName)
		const targetMatch =
			filter.targetMatchAll || filter.targetIEDs.includes(connection.targetIEDName)
		const typeMatch = connection.serviceType === filter.messageType

		return sourceMatch && targetMatch && typeMatch
	})
}

function isReceivedConnectionAllowed(
	iedName: string,
	connection: ReceivedConnection,
	resolvedFilters: ResolvedFilter[]
): boolean {
	return resolvedFilters.some((filter) => {
		const sourceMatch =
			filter.sourceMatchAll || filter.sourceIEDs.includes(connection.iedName)
		const targetMatch =
			filter.targetMatchAll || filter.targetIEDs.includes(iedName)
		const typeMatch = connection.serviceType === filter.messageType

		return sourceMatch && targetMatch && typeMatch
	})
}
