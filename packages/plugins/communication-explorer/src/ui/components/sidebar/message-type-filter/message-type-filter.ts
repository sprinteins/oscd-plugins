import { MESSAGE_TYPE } from '@oscd-plugins/core'
import { setSelectedMessageTypes } from '../../../../stores/_store-view-filter'
// TYPES
import type { MessageType } from '../../../../headless/types'

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

	// The Report filter checkbox was removed from the UI - its
	// functionality is now absorbed into the MMS filter, so toggling
	// MMS shows/hides both MMS and Report message types.
	if (name === MESSAGE_TYPE.MMS) {
		setSelectedMessageTypes(MESSAGE_TYPE.Report, value)
	}
}
