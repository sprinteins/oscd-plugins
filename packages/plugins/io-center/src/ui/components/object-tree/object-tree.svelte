<script lang="ts">
	import type { ObjectTree, TreeNode } from "./object-tree";
	import TreeItem from "./TreeItem.svelte";

	type Props = {
		objectTree: ObjectTree;
	};

	let { objectTree }: Props = $props();
</script>

<div class="w-1/4">
	{#each objectTree as node}
		<TreeItem treeNode={node} />
	{/each}
</div>
