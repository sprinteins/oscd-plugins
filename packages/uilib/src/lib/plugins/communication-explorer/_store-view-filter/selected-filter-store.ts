import { writable } from "svelte/store"
import type { IEDConnectionWithCustomValues, IEDNode } from "../../../components/diagram"
import { allMessageTypes } from "@oscd-plugins/core"

// TODO: we need API that returns if there is an active selection
// and another one to check if a given IED is selected
// There are just too many places where we check and do the same way
// If the check changes we have to go through all places and change it
export type SelectedFilter = {
    selectedIEDs: IEDNode[];
	selectedConnection: IEDConnectionWithCustomValues | undefined;
    incomingConnections: boolean;
    outgoingConnections: boolean;
	incomingMessageFilterActive: boolean;
	outgoingMessageFilterActive: boolean;
    selectedMessageTypes: string[];
	hideIrrelevantStuff: boolean;
	showConnectionArrows: boolean;
	nameFilter: string;
}

export const defaultSelection: SelectedFilter = {
	selectedIEDs:       [],
	selectedConnection: undefined,
	
	incomingConnections: true,
	outgoingConnections: true,

	incomingMessageFilterActive: false,
	outgoingMessageFilterActive: false,

	hideIrrelevantStuff: 	false,
	showConnectionArrows: true,
	nameFilter:          	"",
	selectedMessageTypes: [ ...allMessageTypes ],
}

export const filterState = writable<SelectedFilter>(defaultSelection)
