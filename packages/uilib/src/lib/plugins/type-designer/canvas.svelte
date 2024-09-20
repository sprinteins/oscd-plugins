<script lang="ts">
	import { type TypeCluster } from "./types";
    import Controls from "./components/controls/controls.svelte"
	import { EditorEventHandler } from "./editor-events/editor-event-handler";
    import { getNodeName, Node } from "./components";
	import { onDataTemplatesUpdate } from "./canvas-store"

	export let dataTemplates: Element
	export let root: Element
	export let showSidebar = true

	let htmlRoot: HTMLElement
	let typeCluster: TypeCluster
	let editEventHandler: EditorEventHandler

	$: editEventHandler = new EditorEventHandler(htmlRoot, dataTemplates)
	$: typeCluster = onDataTemplatesUpdate(root, dataTemplates)
</script>

<div class="root" class:showSidebar bind:this={htmlRoot}>
	{#if root}
		<div class="card-container">
			{#each Object.entries(typeCluster) as [componentName, componentArray], componentIndex (componentIndex)}
				{#each componentArray as component (component.id)}
					<Node
						componentData={Object.entries(component).map(([key, value]) => ({ key, value }))}
						componentName={getNodeName(component)}
						componentId={component.id}
					/>
				{/each}
			{/each}
		</div>
		<Controls {editEventHandler} />
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
