<script lang="ts">
    import  { type BayElkNode, type IEDElkNode } from "../../components/diagram"
    import { type BayTypeElement, type IEDTypeElement, type LDeviceTypeElement, SCDQueries, UCTypeDesigner, type VoltageLevelTypeElement } from "@oscd-plugins/core";
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

	const typeDesigner: TypeDesigner = {
		logicalDevices,
		bays,
		ieds,
		voltageLevels
	}

	// TODO name?
	type TypeDesigner = {
		logicalDevices: LDeviceTypeElement[]
		bays: BayTypeElement[]
		ieds: IEDTypeElement[]
		voltageLevels: VoltageLevelTypeElement[]
	}
</script>

<div class="root" class:showSidebar>
	{#if root}
		<Bay {typeDesigner} />
		<AddComponentControls />
	{:else}
		<p>No root</p>
	{/if}
</div>

<style>
</style>
