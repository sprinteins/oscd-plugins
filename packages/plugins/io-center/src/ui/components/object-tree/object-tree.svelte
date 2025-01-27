<script lang="ts">
	import type { ObjectTree, TreeNode } from "./object-tree";
    import TreeItem from "./TreeItem.svelte";

	type Props = {
		objectTree: ObjectTree;
	};

	let { objectTree }: Props = $props();
</script>

<object-tree>
	{#each objectTree as node}
		<TreeItem treeNode={node}/>
	{/each}
</object-tree>
