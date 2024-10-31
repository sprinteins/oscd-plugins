// SVELTE
import { writable, get } from 'svelte/store'
// TYPES
import type { Drawer, DrawerPayload } from './custom-drawer.types'

//==== INITIATORS

const drawerInit: Drawer = {
	isOpen: false,
	title: '',
	description: '',
	component: undefined,
	componentProps: undefined
}

//==== STATE

const drawer = writable(drawerInit)

//==== ACTIONS

function handleOpenDrawer({
	title,
	description,
	component,
	componentProps
}: DrawerPayload) {
	drawer.update(() => ({
		isOpen: true,
		title,
		description: description || '',
		component,
		componentProps
	}))
}

function handleCloseDrawer() {
	drawer.update(() => drawerInit)
}

function handleSwitchDrawer({
	title,
	description,
	component,
	componentProps
}: DrawerPayload) {
	if (get(drawer).isOpen) {
		handleCloseDrawer()
	} else handleOpenDrawer({ title, description, component, componentProps })
}

export default {
	//state
	drawer,
	//actions
	handleOpenDrawer,
	handleCloseDrawer,
	handleSwitchDrawer
}
