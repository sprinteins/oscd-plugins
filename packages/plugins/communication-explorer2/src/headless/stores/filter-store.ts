import { writable, get } from 'svelte/store'
import { MESSAGE_TYPE } from '@oscd-plugins/core'
import type { IEDConnectionWithCustomValues, IEDNode } from '../types/ied.js'

export interface SelectedFilter {
	selectedIEDs: IEDNode[]
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

export function selectIEDNode(node: IEDNode) {
	filterState.update(state => ({
		...state,
		selectedIEDs: [node],
		selectedConnection: undefined
	}))
}

export function toggleMultiSelectionOfIED(node: IEDNode) {
	filterState.update(state => {
		const exists = state.selectedIEDs.find(n => n.id === node.id)
		const selectedIEDs = exists 
			? state.selectedIEDs.filter(n => n.id !== node.id)
			: [...state.selectedIEDs, node]
		
		return {
			...state,
			selectedIEDs,
			selectedConnection: undefined
		}
	})
}

export function selectConnection(connection: IEDConnectionWithCustomValues) {
	filterState.update(state => ({
		...state,
		selectedConnection: connection
	}))
}

export function clearIEDSelection() {
	filterState.update(state => ({
		...state,
		selectedIEDs: [],
		selectedConnection: undefined
	}))
}

export function clearSelection() {
	filterState.set(defaultSelection)
}

export function setNameFilter(nameFilter: string) {
	filterState.update(state => ({
		...state,
		nameFilter
	}))
}

// Additional filter helper functions needed by Diagram component
export function isIEDSelected(node: { label: string }): boolean {
	const selectedIEDs = get(filterState).selectedIEDs
	return selectedIEDs.some((iedNode) => iedNode.label === node.label)
}

export function hasActiveIEDSelection(): boolean {
	const selectedIEDs = get(filterState).selectedIEDs
	return selectedIEDs.length > 0
}

export function isConnectionSelected(connection: IEDConnectionWithCustomValues): boolean {
	const selectedConnection = get(filterState).selectedConnection
	return selectedConnection?.id === connection.id
}

export function changeMessageConnectionFilterDirection(
	incomingMessageFilterActive: boolean,
	outgoingMessageFilterActive: boolean
) {
	filterState.update(state => ({
		...state,
		incomingMessageFilterActive,
		outgoingMessageFilterActive
	}))
}

export function setTargetMessageType(event: Event) {
	const target = event.target as HTMLInputElement
	const messageType = target.name
	const isChecked = target.checked
	
	filterState.update(state => {
		const selectedMessageTypes = isChecked
			? [...state.selectedMessageTypes, messageType]
			: state.selectedMessageTypes.filter(type => type !== messageType)
		
		return {
			...state,
			selectedMessageTypes
		}
	})
}