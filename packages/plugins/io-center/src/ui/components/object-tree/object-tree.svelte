<script lang="ts">
	import type { ObjectTree } from "./types.object-tree";
	import TreeNode from "./tree-node.svelte";

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
			isOpen={treeNode.isOpen}
			isSelectable
			{selectedNodeName}
			{setSelectedNodeName}
		/>
	{/each}
</div>
