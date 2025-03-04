<script lang="ts">
	import { NODE_TYPE } from "@/headless/constants";
	import {
		addObjectToCanvas,
		clearObjectCanvas,
		removeObjectFromCanvas,
		toggleObjectInCanvas,
	} from "@/headless/stores/canvas-operations.svelte";
	import { searchTree } from "@/headless/utils";
	import store from "../../../store.svelte";
	import { canvasStore } from "../canvas/canvas-store.svelte";
	import SearchBar from "../common/search-bar.svelte";
	import TreeNode from "./tree-node.svelte";
	import type { TreeNode as TreeNodeType } from "./types.object-tree";

	let searchTerm = $state("");

	let filteredTree = $derived(searchTree(store.objectTree, searchTerm));

	function addObjectsRecursivelyToCanvas(treeNode: TreeNodeType) {
		if (treeNode.children && treeNode.children?.length - 1 > 0) {
			for (const children of treeNode.children) {
				addObjectsRecursivelyToCanvas(children);
			}
		}
		if (treeNode.type === NODE_TYPE.dataObjectInstance) {
			addObjectToCanvas(treeNode);
		}
	}

	function removeObjectsRecursievlyFromCanvas(treeNode: TreeNodeType) {
		if (treeNode.children && treeNode.children?.length - 1 > 0) {
			for (const children of treeNode.children) {
				removeObjectsRecursievlyFromCanvas(children);
			}
		}
		if (treeNode.type === NODE_TYPE.dataObjectInstance) {
			removeObjectFromCanvas(treeNode);
		}
	}

	function hasAllChildrenSelected(children: TreeNodeType[]) {
		return children.every((child) =>
			canvasStore.dataObjects.some((o) => o.id === child.id),
		);
	}
</script>

<div class="p-2">
	<SearchBar bind:searchTerm placeholder="Search DO" />
	{#each filteredTree as treeNode (treeNode.id)}
		<TreeNode
			{searchTerm}
			{treeNode}
			onclickparentnode={(treeNode) => {
				treeNode.isOpen = !treeNode.isOpen;
			}}
			onclickparentcheckbox={(treeNode) => {
				if (!treeNode.children) {
					return;
				}

				if (hasAllChildrenSelected(treeNode.children)) {
					removeObjectsRecursievlyFromCanvas(treeNode);
				} else {
					addObjectsRecursivelyToCanvas(treeNode);
				}
			}}
			onclickobjectcheckbox={(treeNode) => {
				toggleObjectInCanvas(treeNode);
			}}
			onclickobject={(treeNode) => {
				clearObjectCanvas();
				addObjectToCanvas(treeNode);
			}}
		/>
	{/each}
</div>
