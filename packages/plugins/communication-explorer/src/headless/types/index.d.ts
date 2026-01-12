import type { MESSAGE_TYPE, Utils } from '@oscd-plugins/core'

export type MessageType = Utils.ValueOf<typeof MESSAGE_TYPE>

export interface ConnectionFilter {
	sourceIEDPattern: string
	targetIEDPattern: string
	messageType: string
}

export type ResolvedFilter = {
	sourceIEDs: string[]
	targetIEDs: string[]
	sourceMatchAll: boolean
	targetMatchAll: boolean
	messageType: string
}

export type PublishedConnection = {
	targetIEDName: string
	serviceType: string
}

export type ReceivedConnection = {
	iedName: string
	serviceType: string
}

export type IEDInfo = {
	iedName: string
	published: PublishedConnection[]
	received: ReceivedConnection[]
}

export type IEDInfoWithBays = IEDInfo & {
	bays?: Set<string>
}
