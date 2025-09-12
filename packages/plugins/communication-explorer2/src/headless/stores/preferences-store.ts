import { writable } from 'svelte/store'

export interface Preferences {
	playConnectionAnimation: boolean
	showConnectionArrows: boolean
	isFocusModeOn: boolean
	groupByBay: boolean
}

const defaultPreferences: Preferences = {
	playConnectionAnimation: false,
	showConnectionArrows: true,
	isFocusModeOn: false,
	groupByBay: true
}

export const preferences$ = writable<Preferences>(defaultPreferences)

// TODO: Add local storage adapter functionality later
// initPreferences() functionality can be added when needed