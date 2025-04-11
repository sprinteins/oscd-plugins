import {TemplateOverview, TemplateCreation} from "@/pages"
import {wrap} from 'svelte-spa-router/wrap'
import type { SvelteComponent, ComponentType } from 'svelte'
import type { WrappedComponent } from "svelte-spa-router"
import { ROUTES, ROUTER_PARAMS } from "@/constants"

type Page = ComponentType<SvelteComponent> | WrappedComponent

type Route = {
    [key: string]: Page
}

export const routes : Route = {
	[ROUTES.Home] : TemplateOverview,
	[`${ROUTES.Create}`] : wrap({
		asyncComponent: ()=> TemplateCreation
	}),
	[`${ROUTES.Edit}/${ROUTER_PARAMS.id}`] : wrap({
		asyncComponent: ()=> TemplateCreation
	}),
	[ROUTES.Not_Found]: TemplateOverview
}