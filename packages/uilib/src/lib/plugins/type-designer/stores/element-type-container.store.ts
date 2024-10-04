import { writable } from 'svelte/store';

//==== STATE
const context = writable<HTMLElement>()

function setContext(newContext: HTMLElement) {
	context.set(newContext)
}
export const elementTypeContainerStore = {
	//state
	elementTypeContainerContext: context,
	//actions
	setContext
}