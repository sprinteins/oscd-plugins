import type { MESSAGE_TYPE, Utils } from '@oscd-plugins/core'

export type MessageType = Utils.ValueOf<typeof MESSAGE_TYPE>

export interface MessageTypeFilter {
	type: MessageType;
	sourceIEDs?: string[];
	targetIEDs?: string[];
}

export interface CommunicationMatrix {
	filters?: MessageTypeFilter[];
}