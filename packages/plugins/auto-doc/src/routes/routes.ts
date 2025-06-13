import { ROUTER_PARAMS, ROUTES } from '@/constants'
import { TemplateCreation, TemplateOverview } from '@/pages'
import type { ComponentType, SvelteComponent } from 'svelte'
import type { WrappedComponent } from 'svelte-spa-router'
import { wrap } from 'svelte-spa-router/wrap'

type Page = ComponentType<SvelteComponent> | WrappedComponent

type Route = {
	[key: string]: Page
}

export const routes: Route = {
	[ROUTES.Home]: TemplateOverview,
	[`${ROUTES.Create}`]: wrap({
		asyncComponent: () => TemplateCreation
	}),
	[`${ROUTES.Edit}/${ROUTER_PARAMS.id}`]: wrap({
		asyncComponent: () => TemplateCreation
	}),
	[ROUTES.Not_Found]: TemplateOverview
}
