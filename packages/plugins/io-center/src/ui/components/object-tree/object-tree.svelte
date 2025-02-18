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
	<div class="relative flex">
		<input
			class="bg-gray-50 w-full border-2 border-gray-300 rounded-lg pl-8 py-2"
			bind:value={searchTerm}
			placeholder="Search DO"
		/>
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
