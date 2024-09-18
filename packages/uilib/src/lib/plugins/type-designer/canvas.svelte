<script lang="ts">
	import { type TypeCluster } from "./types";
    import { SCDQueries, UCTypeDesigner } from "@oscd-plugins/core";
    import Bay from "./components/bay.svelte";
    import AddComponentControls from "./components/add-component-controls.svelte";
	import { EditorEventHandler } from "./editor-events/editor-event-handler";
    import { type CreateBayEvent } from "./editor-events/event-types";

	export let dataTemplates: Element
	export let root: Element
	export let showSidebar = true
	let htmlRoot: HTMLElement
	
	const scdQueries = new SCDQueries(root)
	const ucci = new UCTypeDesigner(scdQueries)
	let logicalDevices = ucci.findAllLogicalDevices()
	let bays = ucci.findAllBays()
	let ieds = ucci.findAllIEDs()
	let voltageLevels = ucci.findAllVoltageLevels()
	const typeCluster: TypeCluster = {
		logicalDevices,
		bays,
		ieds,
		voltageLevels
	}

	let editEventHandler: EditorEventHandler
	$: editEventHandler = new EditorEventHandler(htmlRoot, dataTemplates)

	// TODO doesnt belong here, dev version
	function onCreateBay(event: CustomEvent<CreateBayEvent>) {
		console.log("onCreateBay:", event.detail.bay.name)
		editEventHandler.dispatchCreateBay(event.detail)
	}
</script>

<div class="root" class:showSidebar bind:this={htmlRoot}>
	{#if root}
		<Bay {typeCluster} />
		<AddComponentControls onClick={onCreateBay} />
	{:else}
		<p>No root</p>
	{/if}
</div>
