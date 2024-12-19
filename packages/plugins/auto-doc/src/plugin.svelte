
<script lang="ts">
	// COMPONENTS
	import { MaterialTheme, CustomIconButton } from '@oscd-plugins/ui'
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
	
	
	let showBanner = true

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
	


<!-- Plugin logs -->
<input type="hidden" name="package-name" value={jsonPackage.name} />
<input type="hidden" name="package-version" value={jsonPackage.version} />


<MaterialTheme pluginType={pluginType}>
	<auto-doc class="auto-doc">
		{#if xmlDocument}
			{#if showBanner && !import.meta.env.DEV}
				<div class="banner" style="{showBanner ? 'display:flex;' : 'display:none;'}">
					This plugin is in test phase and not suitable for production use.
					<CustomIconButton icon="close" color="white" on:click={() => showBanner = !showBanner} />
				</div>
			{/if}
			<Router {routes} />
		{:else}
			<div class="file-missing">
				<p>No XML file loaded</p>
			</div>
		{/if}
	</auto-doc>
</MaterialTheme>


<style lang="scss">
	.file-missing{
		padding-top: 20px;
		p{
			text-align: center;
		}
	}

	.banner {
		align-items: center;
		justify-content: space-between;
		padding: .25rem 2rem;
		width: 100%;
		background-color: var(--mdc-theme-error);
		color: white;
		position:fixed;
		top: var(--header-height);
		box-sizing: border-box;
		z-index: 1;
	}
</style>

	