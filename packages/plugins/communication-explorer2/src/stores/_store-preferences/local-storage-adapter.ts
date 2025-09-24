import { preferences$, defaultPreferences } from "./preferences-store"

const KEY = "communication-explorer_preferences_ygQZRv"

let inited = false
export function initPreferences(){
	if(inited) { return }

	const stored = window.localStorage.getItem(KEY)
	if(stored){
		try {
			const parsed = JSON.parse(stored)
			// CHANGED_FROM_ORIGNAL: Merge stored preferences with defaults to ensure new properties get default values
			const mergedPreferences = { ...defaultPreferences, ...parsed }
			preferences$.set(mergedPreferences)
		} catch (error) {
			console.error("Failed to parse preferences from local storage", error)
		}
	}

	preferences$.subscribe((value) => {
		window.localStorage.setItem(KEY, JSON.stringify(value))
	})

	inited = true
}
