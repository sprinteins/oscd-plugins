import type { ComponentType } from 'svelte'

export type DrawerPayload = {
	title: string
	description?: string
	component?: ComponentType
	// biome-ignore lint/suspicious/noExplicitAny: there is no way to correctly type the dynamic component props
	componentProps?: Record<string, any>
}
