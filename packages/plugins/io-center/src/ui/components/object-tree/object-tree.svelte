<script lang="ts">
	import { searchTree } from "@/headless/utils";
	import store from "../../../store.svelte";
	import TreeNode from "./tree-node.svelte";
	import { SearchIcon } from "lucide-svelte";

	let selectedNodeIds: string[] = $state([]);

	let searchTerm = $state("");

	let filteredTree = $derived(searchTree(store.objectTree, searchTerm));

	function setSelectedNodeIds(id: string) {
		if (selectedNodeIds.includes(id)) {
			selectedNodeIds = selectedNodeIds.filter((item) => item !== id);
			return;
		}

		selectedNodeIds.push(id);
	}
</script>

<div class="p-2">
	<div class="relative flex w-3/4 mx-auto">
		<input class="relative bg-gray-50 rounded-lg pl-8" bind:value={searchTerm} />
		<SearchIcon
			size={16}
			class="absolute left-2 top-1/2 transform -translate-y-1/2 text-gray-500"
		/>
	</div>
	{#each filteredTree as treeNode (treeNode.id)}
		<TreeNode
			{treeNode}
			isOpen={treeNode.isOpen}
			{searchTerm}
			{selectedNodeIds}
			{setSelectedNodeIds}
		/>
	{/each}
</div>
