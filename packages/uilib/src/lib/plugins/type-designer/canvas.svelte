<script lang="ts">
    import  { type BayElkNode, type IEDElkNode } from "../../components/diagram"
    import { SCDQueries, UCTypeDesigner } from "@oscd-plugins/core";
    import Bay from "./components/bay.svelte";

	export let root: Element
	export let showSidebar = true

	$: initInfos(root)
	
	const scdQueries = new SCDQueries(root)
	const ucci = new UCTypeDesigner(scdQueries)
	let logicalDevices = ucci.findAllLogicalDevices()
	console.log("found: ", logicalDevices)

	function initInfos(root: Element): (IEDElkNode | BayElkNode)[] {
		const nodes = Array.from(root.children).map((child, index) => {
			return {
				id: `node${index}`,
				label: child.tagName,
				children: [],
			};
		});
		return nodes;
	}
</script>

<div class="root" class:showSidebar>
	{#if root}
		{#each logicalDevices as device (device.id)}
			<Bay id={device.id} desc={device.desc} inst={device.inst} />
		{/each}
	{:else}
		<p>No root</p>
	{/if}
</div>

<style>
</style>
