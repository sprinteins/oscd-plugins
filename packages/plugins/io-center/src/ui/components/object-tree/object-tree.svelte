<script lang="ts">
	import { searchTree } from "@/headless/utils";
	import store from "../../../store.svelte";
	import TreeNode from "./tree-node.svelte";
	import SearchBar from "../search-bar.svelte";

	let searchTerm = $state("");

	let filteredTree = $derived(searchTree(store.objectTree, searchTerm));
</script>

<div class="p-2">
	<SearchBar bind:searchTerm />
	{#each filteredTree as treeNode (treeNode.id)}
		<TreeNode {treeNode} isOpen={treeNode.isOpen} {searchTerm} />
	{/each}
</div>
