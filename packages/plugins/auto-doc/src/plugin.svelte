
<script lang="ts">
	import { run } from 'svelte/legacy';

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
	
	interface Props {
		//props
		xmlDocument?: XMLDocument | undefined;
		pluginHostElement: Element;
		pluginType?: PluginType;
		editCount: number;
	}

	let {
		xmlDocument = undefined,
		pluginHostElement,
		pluginType = 'editor',
		editCount
	}: Props = $props();
	
	

	
	async function triggerUpdate(
		{updateTrigger, newXMLDocument, newPluginHostElement, newEditCount} : 
		{updateTrigger: number, newXMLDocument: XMLDocument|undefined, newPluginHostElement: Element, newEditCount: number}
	){
		await pluginStore.init({
			newXMLDocument,
			newPluginHostElement,
			newEditCount,
		})
		docTemplatesStore.init()
	}
	//==== REACTIVITY ====//
	
	
	run(() => {
		triggerUpdate({
			updateTrigger: editCount,
			newXMLDocument: xmlDocument,
			newPluginHostElement: pluginHostElement,
			newEditCount: editCount,
		})
	});
</script>
	


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

	