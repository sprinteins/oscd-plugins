export enum ConnectionTypeDirection {
	INCOMING = 'INCOMING',
	OUTGOING = 'OUTGOING'
}

export type ServiceItem<T, TMessageType extends string = string> = {
	node: T
	serviceType: TMessageType
	serviceTypeLabel?: string
	connectionDirection: ConnectionTypeDirection
}

export function createServiceItems<T, TMessageType extends string>(relations: {
	subscribedFrom: Array<{
		node: T
		serviceType: TMessageType
		serviceTypeLabel?: string
	}>
	publishedTo: Array<{
		node: T
		serviceType: TMessageType
		serviceTypeLabel?: string
	}>
}): ServiceItem<T, TMessageType>[] {
	return [
		...relations.subscribedFrom.map((item) => ({
			...item,
			connectionDirection: ConnectionTypeDirection.OUTGOING
		})),
		...relations.publishedTo.map((item) => ({
			...item,
			connectionDirection: ConnectionTypeDirection.INCOMING
		}))
	]
}

export function filterVisibleServiceItems<T, TMessageType extends string>(
	items: ServiceItem<T, TMessageType>[],
	filter: {
		selectedMessageTypes: string[]
		incomingConnections: boolean
		outgoingConnections: boolean
	}
): ServiceItem<T, TMessageType>[] {
	return items.filter((item) => {
		const messageTypeIsVisible = filter.selectedMessageTypes.includes(
			item.serviceType
		)
		const directionIsVisible =
			(filter.incomingConnections &&
				item.connectionDirection ===
					ConnectionTypeDirection.INCOMING) ||
			(filter.outgoingConnections &&
				item.connectionDirection === ConnectionTypeDirection.OUTGOING)

		return messageTypeIsVisible && directionIsVisible
	})
}
