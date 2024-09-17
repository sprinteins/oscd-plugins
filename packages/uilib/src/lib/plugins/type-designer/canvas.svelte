<script lang="ts">
	import { type TypeCluster } from "./types";
    import { SCDQueries, UCTypeDesigner } from "@oscd-plugins/core";
    import Bay from "./components/bay.svelte";
    import AddComponentControls from "./components/add-component-controls.svelte";

	export let root: Element
	export let showSidebar = true
	
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
</script>

<div class="root" class:showSidebar>
	{#if root}
		<Bay {typeCluster} />
		<AddComponentControls />
	{:else}
		<p>No root</p>
	{/if}
</div>
