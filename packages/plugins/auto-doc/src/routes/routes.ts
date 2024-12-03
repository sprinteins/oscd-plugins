import {TemplateOverview} from "@/pages"
import {wrap} from 'svelte-spa-router/wrap'
import type { SvelteComponent, ComponentType } from 'svelte'
import type { WrappedComponent } from "svelte-spa-router"

type Page = ComponentType<SvelteComponent> | WrappedComponent

type Route = {
    [key: string]: Page
}

export const routes : Route = {
	"/" : TemplateOverview,
	"/create/:id" : wrap({
		asyncComponent: ()=> import("@/pages/template-creation/template-creation.svelte")
	}),
	"*": TemplateOverview
}