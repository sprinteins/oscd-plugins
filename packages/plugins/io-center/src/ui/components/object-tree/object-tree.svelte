<script lang="ts">
	import type { ObjectTree } from "./object-tree";
	import { Accordion } from "@oscd-plugins/core-ui-svelte";
	import type { TreeNode as TreeNodeType } from "./object-tree";
	import TreeNode from "./tree-node.svelte";

	type Props = {
		objectTree: ObjectTree;
	};

	let { objectTree }: Props = $props();

	const getOpenItems = (nodes: TreeNodeType[]): string[] =>
		nodes.reduce<string[]>(
			(acc, node) => [
				...acc,
				...(node.isOpen ? [node.name] : []),
				...(node.children ? getOpenItems(node.children) : []),
			],
			[],
		);
</script>

<Accordion.Root value={getOpenItems(objectTree)} type="multiple" class="w-1/4">
	{#each objectTree as treeNode}
		<TreeNode {treeNode} />
	{/each}
</Accordion.Root>
