import type { IEDElkNode } from '../../diagram/nodes'
import type { MessageType } from '../../../../headless/types'

export type ServiceTypeGroup = Map<string, ServiceObject[]>

export enum ConnectionTypeDirection {
	INCOMING = 'INCOMING',
	OUTGOING = 'OUTGOING'
}

export type ServiceObject = {
	node: IEDElkNode
	serviceType: MessageType
	serviceTypeLabel?: string
	connectionDirection: ConnectionTypeDirection
}
