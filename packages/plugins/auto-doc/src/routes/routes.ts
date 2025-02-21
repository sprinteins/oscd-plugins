import {TemplateOverview} from "@/pages"
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
	[`${ROUTES.Create}/${ROUTER_PARAMS.id}`] : wrap({
		asyncComponent: ()=> import("@/pages/template-creation/template-creation.svelte")
	}),
	[`${ROUTES.Edit}/${ROUTER_PARAMS.id}`] : wrap({
		asyncComponent: ()=> import("@/pages/template-creation/template-creation.svelte")
	}),
	[ROUTES.Not_Found]: TemplateOverview
}