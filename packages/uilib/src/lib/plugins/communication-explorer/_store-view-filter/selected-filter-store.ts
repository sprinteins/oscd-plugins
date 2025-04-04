import { writable } from 'svelte/store'
// CONSTANTS
import { MESSAGE_TYPE } from '@oscd-plugins/core'
// TYPES
import type {
	IEDConnectionWithCustomValues,
	IEDElkNode
} from '../../../components/diagram'

// TODO: we need API that returns if there is an active selection
// and another one to check if a given IED is selected
// There are just too many places where we check and do the same way
// If the check changes we have to go through all places and change it
export type SelectedFilter = {
	selectedIEDs: IEDElkNode[]
	selectedConnection: IEDConnectionWithCustomValues | undefined
	incomingConnections: boolean
	outgoingConnections: boolean
	incomingMessageFilterActive: boolean
	outgoingMessageFilterActive: boolean
	selectedMessageTypes: string[]
	hideIrrelevantStuff: boolean
	showConnectionArrows: boolean
	nameFilter: string
}

export const defaultSelection: SelectedFilter = {
	selectedIEDs: [],
	selectedConnection: undefined,

	incomingConnections: true,
	outgoingConnections: true,

	incomingMessageFilterActive: false,
	outgoingMessageFilterActive: false,

	hideIrrelevantStuff: false,
	showConnectionArrows: true,
	nameFilter: '',
	selectedMessageTypes: Object.values(MESSAGE_TYPE)
}

export const filterState = writable<SelectedFilter>(defaultSelection)
