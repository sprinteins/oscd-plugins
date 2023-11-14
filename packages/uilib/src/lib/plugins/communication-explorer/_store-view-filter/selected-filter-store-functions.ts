import { filterState } from "./selected-filter-store"
import type { IEDConnectionWithCustomValues, IEDNode } from "../../../components/diagram"
import { MessageType, allMessageTypes } from "@oscd-plugins/core"
import { get } from "svelte/store"

export function selectIEDNode(node: IEDNode) {
	filterState.update(selectedFilter => {
		return {
			...selectedFilter,
			selectedIEDs:       [node],
			selectedConnection: undefined,
		}
	})
}

export function toggleMultiSelectionOfIED(node: IEDNode){
	filterState.update(selectedFilter => {

		const selectedIEDs = selectedFilter.selectedIEDs
		const isAlreadySelected = _isIEDSelected(node, selectedIEDs)

		let newSelectedIEDs: IEDNode[] = []
		if(!isAlreadySelected){
			newSelectedIEDs = [...selectedFilter.selectedIEDs, node]
		}else{
			newSelectedIEDs = selectedIEDs.filter(selectedIED => selectedIED.id !== node.id)
		}

		const newFilterState = {
			...selectedFilter,
			selectedIEDs:       newSelectedIEDs,
			selectedConnection: undefined,
		}
		return newFilterState
	})
}


export function clearIEDSelection() {
	filterState.update(selectedFilter => {
		return {
			...selectedFilter,
			selectedIEDs:       [],
			selectedConnection: undefined,
		}
	})
}

export function selectConnection(connection: IEDConnectionWithCustomValues) {
	filterState.update(selectedFilter => {
		return {
			...selectedFilter,
			selectedConnection: connection,
			selectedIEDs:       [],
		}
	})
}

export function clearSelection() {
	filterState.update(selectedFilter => {
		return {
			...selectedFilter,
			incomingConnections:         true,
			outgoingConnections:         true,
			incomingMessageFilterActive: false,
			outgoingMessageFilterActive: false,
			selectedMessageTypes:        [...allMessageTypes],
			selectedIEDs:                [],
			selectedConnection:          undefined,
		}
	})
}

export function changeMessageConnectionFilterDirection(inc: boolean, out: boolean) {

	let incoming = true
	let outgoing = true

	if (inc || out) {
		incoming = inc
		outgoing = out
	}

	if (!inc && !out) {
		incoming = true
		outgoing = true
	}

	filterState.update((value) => {
		return {
			...value,
			incomingConnections:         incoming,
			outgoingConnections:         outgoing,
			incomingMessageFilterActive: inc,
			outgoingMessageFilterActive: out,
		}
	})
}


function addOrRemoveMessageType(list: string[], messageType: string, checked: boolean): string[] {
	if (checked) {

		const containsTypeAlready = list.includes(messageType)
		if (!containsTypeAlready) {
			list.push(messageType)
		}

		return list
	}

	return list.filter((item) => item !== messageType)
}

export function setSelectedMessageTypes(type: MessageType, isActived: boolean) {
	filterState.update((value) => {
		return {
			...value, 
			selectedMessageTypes: addOrRemoveMessageType(value.selectedMessageTypes, type, isActived),
		}
	})
}

export function setHideIrrelevantStuff(hide: boolean) {
	filterState.update((value) => {
		return {
			...value, 
			hideIrrelevantStuff: hide,
		}
	})
}

export function setHideConnectionArrows(hide: boolean) {
	filterState.update((value) => {
		return {
			...value,
			showConnectionArrows: hide,
		}
	})
}

export function setNameFilter(filter: string) {
	filterState.update((value) => {
		return {
			...value, 
			nameFilter: filter,
		}
	})
}

export function isIEDSelected(node: {label: string}): boolean {
	const selectedIEDs = get(filterState).selectedIEDs
	const isSelected = _isIEDSelected(node, selectedIEDs)
	return isSelected
}

function _isIEDSelected(node: {label: string}, selectedIEDs: IEDNode[]): boolean {
	return selectedIEDs.some(iedNode => iedNode.label === node.label)
}

export function hasActiveIEDSelection(): boolean {
	const selectedIEDs = get(filterState).selectedIEDs
	return selectedIEDs.length > 0
}

export function isConnectionSelected(connection: IEDConnectionWithCustomValues): boolean {
	const selectedConnection = get(filterState).selectedConnection
	return selectedConnection?.id === connection.id
}
