import { preferences$ } from "./preferences-store"

const KEY = "communication-explorer_preferences_ygQZRv"

let inited = false
export function initPreferences(){
	if(inited) { return }

	const stored = window.localStorage.getItem(KEY)
	if(stored){
		try {
			const parsed = JSON.parse(stored)
			preferences$.set(parsed)
		} catch (error) {
			console.error("Failed to parse preferences from local storage", error)
		}
	}

	preferences$.subscribe((value) => {
		window.localStorage.setItem(KEY, JSON.stringify(value))
	})

	inited = true
}
