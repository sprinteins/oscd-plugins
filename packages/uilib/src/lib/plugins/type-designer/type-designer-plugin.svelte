<script lang="ts">
	import { onMount } from 'svelte';
	import { SCDQueries } from '@oscd-plugins/core';
	// COMPONENTS
	import { SvelteFlowProvider } from '@xyflow/svelte';
	import Theme from '../../theme/theme.svelte';
	import { ElementsTypeContainer } from './components';
	// STORES
	import { dataTypeTemplatesStore, xmlDocumentStore } from './stores';

	//==== INITIALIZATION ====//
	//props
	export let xmlDocument: XMLDocument;

	// refs
	let htmlRoot: HTMLElement;
	//let currentXmlDocument: Element
	// let _editCount: number
	//let scdQueries = new SCDQueries(xmlDocumentRootElement)

	//==== REACTIVE DECLARATIONS ====//
	// $: xmlDocumentStore.init(xmlDocument);
	// $: dataTypesTemplatesStore.init($xmlDocumentStore);

	//==== HOOKS ====//
	onMount(function () {
		xmlDocumentStore.init(xmlDocument);
		dataTypeTemplatesStore.init(xmlDocument.documentElement);
	});
</script>

<Theme>
	<SvelteFlowProvider>
		<type-designer bind:this={htmlRoot}>
			<ElementsTypeContainer />
		</type-designer>
	</SvelteFlowProvider>
</Theme>

<style>
	:root,
	:host {
		--header-height: 128px;
	}
	type-designer {
		height: calc(100vh - var(--header-height));
		display: flex;
		align-items: stretch;
		position: relative;
	}
</style>
