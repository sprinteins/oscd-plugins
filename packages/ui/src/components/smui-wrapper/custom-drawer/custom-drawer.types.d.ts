import type { ComponentType } from 'svelte'

export type Drawer = {
	isOpen: boolean
	title: string
	description?: string
	component?: ComponentType
	// biome-ignore lint/suspicious/noExplicitAny: there is no way to correctly type the dynamic component props
	componentProps?: Record<string, any>
}

export type DrawerPayload = Omit<Drawer, 'isOpen'>
