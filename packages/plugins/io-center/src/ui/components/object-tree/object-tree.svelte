<script lang="ts">
	import type { ObjectTree } from "./types.object-tree";
	import { Accordion } from "@oscd-plugins/core-ui-svelte";
	import TreeNode from "./tree-node.svelte";
	import { getOpenItems } from "./utils";

	type Props = {
		objectTree: ObjectTree;
	};

	let { objectTree }: Props = $props();

	let selectedNodeName = $state("");

	function setSelectedNodeName(name: string) {
		selectedNodeName = name;
	}
</script>

<div class="p-2">
	{#each objectTree as treeNode}
		<TreeNode
			{treeNode}
			isSelectable
			{selectedNodeName}
			{setSelectedNodeName}
		/>
	{/each}
</div>
