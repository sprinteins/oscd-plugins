<script lang="ts">
	import { store } from "../../../store.svelte";
	import TreeNode from "./tree-node.svelte";
	import SearchBar from "../common/search-bar.svelte";
	import type { TreeNode as TreeNodeType } from "./types.object-tree";
	import { NODE_TYPE } from "@/headless/constants";
	import type {
		ObjectNodeDataObject,
		ObjectTree,
	} from "../../../ied/object-tree.type";
	import { gatherDataObjects } from "./utils";

	let tree = $state<TreeNodeType[]>([]);
	let openIDs: string[] = [];

	// Note: we use $effect instead of $derived so we can change the values of filteredTree
	$effect(() => {
		tree = convertToTreeNode(store.objectTree);
	});
	// Note: we use $effect instead of $derived because $derived makes
	//		 `openIDs` a reactive value, which we don't want
	// 		 because it  causes an infinite reactive loop
	$effect(() => {
		openIDs = tree.flatMap((node) => idsOfOpenNodes(node));
	});

	let searchTerm = $state("");
	let filteredTree = $state<TreeNodeType[]>([]);

	$effect(() => {
		filteredTree = filterTree(tree, searchTerm);
	});

	function convertToTreeNode(objectTree: ObjectTree): TreeNodeType[] {
		const treeNodes: TreeNodeType[] = objectTree.ied?.children.map((ld) => {
			return {
				id: ld.id,
				name: ld.inst,
				type: NODE_TYPE.logicalDevice,
				isOpen: wasNodeAlreadyOpen(ld.id),
				children: ld.children.map((ln) => {
					return {
						id: ln.id,
						name: `${ln.lnClass} - ${ln.inst}`,
						type: NODE_TYPE.logicalNode,
						isOpen: wasNodeAlreadyOpen(ln.id),
						children: ln.children.map((dataObject) => {
							return {
								id: dataObject.id,
								name: dataObject.name,
								type: NODE_TYPE.dataObjectInstance,
								dataObject,
							};
						}),
					};
				}),
			};
		});

		return treeNodes;
	}

	function idsOfOpenNodes(node: TreeNodeType): string[] {
		const ids: string[] = [];
		if (node.isOpen) {
			ids.push(node.id);
		}
		if (node.children) {
			for (const child of node.children) {
				ids.push(...idsOfOpenNodes(child));
			}
		}
		return ids;
	}

	function wasNodeAlreadyOpen(id: string) {
		return openIDs.includes(id);
	}

	function filterTree(
		nodes: TreeNodeType[],
		searchTerm: string,
	): TreeNodeType[] {
		if (searchTerm === "") {
			return nodes;
		}
		return nodes
			.map((node) => {
				if (
					node.name.toLowerCase().includes(searchTerm.toLowerCase())
				) {
					return node;
				}
				if (!node.children) {
					return;
				}
				if (node.children?.length === 0) {
					return;
				}

				const filteredChildren = filterTree(node.children, searchTerm);

				if (filteredChildren.length !== 0) {
					return { ...node, children: filteredChildren };
				}
			})
			.filter(Boolean) as TreeNodeType[];
	}

	/* 	function addObjectsRecursivelyToCanvasV2(treeNode: TreeNodeType) {
		if (treeNode.children && treeNode.children?.length - 1 > 0) {
			const dataObjects = gatherDataObjects(treeNode.children);
			for (const dataObject of dataObjects) {
				ensureObjectIsInStore(dataObject);
			}
		}
	} */

	/*  function removeObjectsRecursivelyFromCanvasV2(treeNode: TreeNodeType) {
		if (treeNode.children && treeNode.children?.length - 1 > 0) {
			const dataObjects = gatherDataObjects(treeNode.children);
			const indicies = dataObjects.map((dataObject) =>
				findObjectIndexInStore(dataObject),
			);
			store.selectedDataObjects = store.selectedDataObjects.filter(
				(_, index) => !indicies.includes(index),
			);
		}
	} */

	/* 	function hasAllChildrenSelected(children: TreeNodeType[]) {
		const dataObjects = gatherDataObjects(children);
		return dataObjects.every((dataObject) =>
			store.selectedDataObjects.some((o) => o.id === dataObject.id),
		);
	} */

	// #region Store Functions

	function toggleObjectInStore(dataObject: ObjectNodeDataObject) {
		if (dataObject.id === store.selectedDataObject?.id) {
			store.selectedDataObject = null;
		} else {
			store.selectedDataObject = dataObject;
		}
	}

	function ensureObjectIsInStore(dataObject: ObjectNodeDataObject) {
		if (dataObject.id === store.selectedDataObject?.id) {
			return;
		}

		store.selectedDataObject = dataObject;
	}

	/* 	function findObjectIndexInStore(dataObject: ObjectNodeDataObject) {
		return store.selectedDataObjects.findIndex(
			(o) => o.id === dataObject.id,
		);
	} */
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
				/* if (!treeNode.children) {
					return;
				}

				if (hasAllChildrenSelected(treeNode.children)) {
					removeObjectsRecursivelyFromCanvasV2(treeNode);
				} else {
					addObjectsRecursivelyToCanvasV2(treeNode);
				} */
			}}
			onclickobjectcheckbox={(treeNode) => {
				const dataObject = treeNode.dataObject;
				if (!dataObject) {
					console.warn("No dataObject found");
					return;
				}
				toggleObjectInStore(dataObject);
			}}
			onclickobject={(treeNode) => {
				const dataObject = treeNode.dataObject;
				if (!dataObject) {
					console.warn("No dataObject found");
					return;
				}
				ensureObjectIsInStore(dataObject);
			}}
		/>
	{/each}
</div>
