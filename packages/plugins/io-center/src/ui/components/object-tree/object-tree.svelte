<script lang="ts">
	import store from "../../../store.svelte";
	import TreeNode from "./tree-node.svelte";

	let selectedNodeName = $state("");

	function setSelectedNodeName(name: string) {
		selectedNodeName = name;
	}
</script>

<div class="p-2">
	{#each store.objectTree as treeNode}
		<TreeNode
			{treeNode}
			isOpen={treeNode.isOpen}
			isSelectable
			{selectedNodeName}
			{setSelectedNodeName}
		/>
	{/each}
</div>
