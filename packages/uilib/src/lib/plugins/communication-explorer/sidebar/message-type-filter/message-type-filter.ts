import { setSelectedMessageTypes } from '../../_store-view-filter'
// TYPES
import type { MessageType } from '../../types'

export function isSelected(
	messageType: MessageType,
	selectedMessages: string[] = [],
	checkboxIsSelected?: boolean
) {
	const doesInclude = selectedMessages.includes(messageType)
	if (checkboxIsSelected === undefined) {
		return doesInclude
	}
	return doesInclude && checkboxIsSelected
}

export function setTargetMessageType(e: Event) {
	const element = e?.target as HTMLInputElement
	const name = element?.name as MessageType
	const value = element?.checked

	setSelectedMessageTypes(name, value)
}
