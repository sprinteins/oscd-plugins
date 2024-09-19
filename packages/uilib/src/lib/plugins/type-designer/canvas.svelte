<script lang="ts">
	import { type TypeCluster } from "./types";
    import { type DataTypeTemplatesElement, SCDQueries, UCTypeDesigner } from "@oscd-plugins/core";
    import AddComponentControls from "./components/add-component-controls.svelte";
	import { EditorEventHandler } from "./editor-events/editor-event-handler";
    import { Node } from "./components";

	// TODO aufraeumen in store packen

	// TODO undefined weg
	export let dataTemplates: Element | undefined
	export let root: Element
	export let showSidebar = true

	let htmlRoot: HTMLElement
	let typeCluster: TypeCluster
	let editEventHandler: EditorEventHandler

	$: editEventHandler = new EditorEventHandler(htmlRoot, dataTemplates)
	$: onDataTemplatesUpdate(dataTemplates)

	function onDataTemplatesUpdate(dataTemplates: Element) {
		console.log("[!] onDataTemplatesUpdate")
		updateCluster(root)
	}

	function updateCluster(root: Element) {
		const scdQueries = new SCDQueries(root)
		const ucci = new UCTypeDesigner(scdQueries)
		let logicalDevices = ucci.findAllLogicalDevices()
		let bays = ucci.findAllBays()
		let ieds = ucci.findAllIEDs()
		let voltageLevels = ucci.findAllVoltageLevels()
		typeCluster = {
			logicalDevices,
			bays,
			ieds,
			voltageLevels
		}
	}
</script>

<div class="root" class:showSidebar bind:this={htmlRoot}>
	{#if root}
		<div class="card-container">
			{#each Object.entries(typeCluster) as [componentName, componentArray], componentIndex (componentIndex)}
				{#each componentArray as component (component.id)}
					<Node
						componentData={Object.entries(component).map(([key, value]) => ({ key, value }))}
						componentName={componentName}
						componentId={component.id}
					/>
				{/each}
			{/each}
		</div>
		<AddComponentControls {editEventHandler} />
	{:else}
		<p>No root</p>
	{/if}
</div>

<style>
    .card-container {
        display: grid;
        grid-template-columns: repeat(auto-fill, minmax(200px, 1fr));
        grid-gap: 1rem;
        align-items: start;
    }
</style>
