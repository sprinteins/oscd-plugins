// SVELTE
import { writable, get } from 'svelte/store'
// TYPES
import type { DrawerPayload } from './custom-drawer.types'

//==== STATE
const open = writable<boolean>(false)

const currentTitle = writable<DrawerPayload['title']>('')
const currentDescription = writable<DrawerPayload['description']>('')
const currentInnerComponent = writable<DrawerPayload['component']>(undefined)
const currentInnerComponentProps =
	writable<DrawerPayload['componentProps']>(undefined)

//==== ACTIONS

function openDrawer({
	title,
	description,
	component,
	componentProps
}: DrawerPayload) {
	currentTitle.set(title)
	currentDescription.set(description || '')
	currentInnerComponent.set(component)
	currentInnerComponentProps.set(componentProps)

	open.set(true)
}

function closeDrawer() {
	currentTitle.set('')
	currentDescription.set('')
	currentInnerComponent.set(undefined)
	currentInnerComponentProps.set(undefined)
	open.set(false)
}

function switchDrawer({
	title,
	description,
	component,
	componentProps
}: DrawerPayload) {
	if (get(open)) {
		closeDrawer()
	} else openDrawer({ title, description, component, componentProps })
}

export default {
	//state
	open,
	currentTitle,
	currentDescription,
	currentInnerComponent,
	currentInnerComponentProps,
	//actions
	openDrawer,
	closeDrawer,
	switchDrawer
}
