import { writable } from "svelte/store"
import { initPreferences } from "./local-storage-adapter"

export type Preferences = {
	playConnectionAnimation: boolean;
	showConnectionArrows: boolean;
	isFocusModeOn: boolean;
	groupByBay: boolean;
}

const defaultPreferences: Preferences = {
	playConnectionAnimation: false,
	showConnectionArrows:    true,
	isFocusModeOn:           false,
	groupByBay:				 true
}


export const preferences$ = writable<Preferences>(defaultPreferences) 

// whoever first imports this file will initialize the preferences store
initPreferences()