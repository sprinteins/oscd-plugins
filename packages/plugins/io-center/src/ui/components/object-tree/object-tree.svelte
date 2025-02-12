<script lang="ts">
	import { searchTree } from "@/headless/utils";
	import store from "../../../store.svelte";
	import TreeNode from "./tree-node.svelte";
	import { SearchIcon } from "lucide-svelte";

	let selectedNodeName = $state("");

	let searchTerm = $state("");

	let filteredTree = $derived(searchTree(store.objectTree, searchTerm));

	function setSelectedNodeName(name: string) {
		selectedNodeName = name;
	}
</script>

<div class="p-2">
	<div class="relative flex bg-gray-50 rounded-lg">
		<input class="bg-gray-50 rounded-lg pl-8" bind:value={searchTerm} />
		<SearchIcon
			size={16}
			class="absolute left-2 top-1/2 transform -translate-y-1/2 text-gray-500"
		/>
	</div>
	{#each filteredTree as treeNode}
		<TreeNode
			{treeNode}
			isOpen={treeNode.isOpen}
			{searchTerm}
			isSelectable
			{selectedNodeName}
			{setSelectedNodeName}
		/>
	{/each}
</div>
