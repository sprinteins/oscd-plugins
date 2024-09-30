<script lang="ts">
	import { onMount } from 'svelte';
	// COMPONENTS
	import AddElementType from './add-element-type.svelte';
	// STORES
	import { xmlDocumentStore, elementTypeContainerStore } from '../../stores';

	//refs
	let elementTypeContainerContext: HTMLElement;

	//stores
	const { xmlDocument } = xmlDocumentStore;

	//==== HOOKS ====//
	onMount(function () {
		elementTypeContainerStore.setContext(elementTypeContainerContext);
	});
</script>

<div class="root" bind:this={elementTypeContainerContext}>
	{#if $xmlDocument}
		<AddElementType />
	{:else}
		<p>No xml document loaded</p>
	{/if}
</div>

<style>
</style>
