// TYPES
import type { MessageType } from '../../../../headless/types'
import { setSelectedMessageTypes } from '../../../../stores/_store-view-filter'

export function isSelected(
	messageType: MessageType,
	selectedMessages: string[] = []
) {
	return selectedMessages.includes(messageType)
}

export function setTargetMessageType(type: MessageType, checked: boolean) {
	setSelectedMessageTypes(type, checked)
}
