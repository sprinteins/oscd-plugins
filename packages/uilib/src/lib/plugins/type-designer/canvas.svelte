<script lang="ts">
    import  { type BayElkNode, type IEDElkNode } from "../../components/diagram"
    import { SCDQueries, UCTypeDesigner } from "@oscd-plugins/core";

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
			<div>
				{device.id}
			</div>
			<div>
				{device.desc}
			</div>
			<div>
				{device.inst}
			</div>
		{/each}
	{:else}
		<p>No root</p>
	{/if}
</div>

<style>
	.root {
		--header-height: 128px;
		display: grid;
		grid-template-columns: auto 0;
		height: calc(100vh - var(--header-height));
		width: 100%;
		overflow-x: hidden;
	}
	
	.root.showSidebar {
		grid-template-columns: auto var(--sidebar-width);
	}
</style>
