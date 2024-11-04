import {TemplateOverview} from "@/pages"
import {wrap} from 'svelte-spa-router/wrap'

export const routes = {
	"/" : TemplateOverview,
	"/create" : wrap({
		asyncComponent: ()=> import("@/pages/template-creation/template-creation.svelte")
	}),
	"*": TemplateOverview
}