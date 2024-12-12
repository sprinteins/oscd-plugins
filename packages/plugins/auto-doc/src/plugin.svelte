
<!-- Plugin logs -->
<input type="hidden" name="package-name" value={jsonPackage.name} />
<input type="hidden" name="package-version" value={jsonPackage.version} />


<MaterialTheme pluginType={pluginType}>
	<auto-doc class="auto-doc">
		{#if xmlDocument}
			<Router {routes} />
		{:else}
			<div class="file-missing">
				<p>No XML file loaded</p>
			</div>
		{/if}
	</auto-doc>
</MaterialTheme>

<script lang="ts">
// COMPONENTS
import { MaterialTheme } from '@oscd-plugins/ui'
import Router from 'svelte-spa-router'
import {routes} from '@/routes/routes'

// PACKAGE
import jsonPackage from '../package.json'
// STORES
import { pluginStore, docTemplatesStore } from './stores'
// TYPES
import type { PluginType } from '@oscd-plugins/core'

//==== INITIALIZATION ====//
//props
export let xmlDocument: XMLDocument | undefined = undefined
export let pluginHostElement: Element
export let pluginType: PluginType = 'editor'
export let editCount: number


//==== REACTIVITY ====//


$: triggerUpdate({
	updateTrigger: editCount,
	newXMLDocument: xmlDocument,
	newPluginHostElement: pluginHostElement
})

async function triggerUpdate(
	{updateTrigger, newXMLDocument, newPluginHostElement} : 
	{updateTrigger: number, newXMLDocument: XMLDocument|undefined, newPluginHostElement: Element}
){
	await pluginStore.init({
		newXMLDocument,
		newPluginHostElement
	})
	docTemplatesStore.init()
}


</script>



<style lang="scss">
	.file-missing{
		padding-top: 20px;
		p{
			text-align: center;
		}
	}
</style>

	