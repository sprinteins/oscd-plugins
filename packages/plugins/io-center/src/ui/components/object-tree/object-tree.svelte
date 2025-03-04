
<div class="p-2">
	<SearchBar bind:searchTerm />
	{#each filteredTreeV2 as treeNode (treeNode.id)}
		<TreeNode 
			{searchTerm} 
			{treeNode}

			onclickparentnode = { (treeNode) => {
				treeNode.isOpen = !treeNode.isOpen
			}}

			onclickparentcheckbox = { (treeNode) => {
				if(!treeNode.children){ return }

				if(hasAllChildrenSelected(treeNode.children)){
					removeObjectsRecursievlyFromCanvasV2(treeNode)
				}else{
					addObjectsRecursievlyToCanvasV2(treeNode)
				}
			}}

			onclickobjectcheckbox = { (treeNode) => {
				const dataObject = treeNode.dataObject
				if(!dataObject){ console.warn("No dataObject found"); return }
				toggleObjectInStore(dataObject)

			}}

			onclickobject = { (treeNode) => {
				const dataObject = treeNode.dataObject
				if(!dataObject){ console.warn("No dataObject found"); return }	
				store.selectedDataObjects = [dataObject]
			}}
		/>
	{/each}
</div>


<script lang="ts">
	import {store} from "../../../store.svelte";
	import TreeNode from "./tree-node.svelte";
	import SearchBar from "../search-bar.svelte";
	import type { TreeNode as TreeNodeType } from "./types.object-tree";
	import { NODE_TYPE } from "@/headless/constants"
    import type { ObjectNodeDataObject, ObjectTree } from "../../../ied/object-tree.type";
	import { gatherDataObjects } from "./utils"

	let searchTerm = $state("");
	let filteredTreeV2 = $state<TreeNodeType[]>([]); 
	$inspect("filteredTreeV2", filteredTreeV2)
	$inspect("objectTree", store.objectTree)
	// Note: we use $effect instead of $derived so we can change the values of filteredTree
	$effect( () => { filteredTreeV2 = convertToTreeNode(store.objectTreeV2) })

	function convertToTreeNode(objectTree: ObjectTree, searchTerm: string): TreeNodeType[] {
		const treeNodes: TreeNodeType[] = objectTree
			.ied?.children.map( (ld) => {
				return {
					id: ld.id,
					name: ld.inst,
					type: NODE_TYPE.logicalDevice,
					isOpen: false,
					children: ld.children.map((ln) => {
						return {
							id: ln.id,
							name: `${ln.lnClass} - ${ln.inst}`,
							type: NODE_TYPE.logicalNode,
							isOpen: false,
							children: ln.children.map( (dataObject) => {
								return {
									id: dataObject.id,
									name: dataObject.name,
									type: NODE_TYPE.dataObjectInstance,
									dataObject,
								}
							})
						}
					})
				}
		});

		return treeNodes
	}
	
	function addObjectsRecursievlyToCanvasV2(treeNode: TreeNodeType){

		if(treeNode.children && treeNode.children?.length -1 > 0){
			const dataObjects = gatherDataObjects(treeNode.children)
			for(const dataObject of dataObjects){
				ensureObjectIsInStore(dataObject)
			}
		}
	}
	
	function removeObjectsRecursievlyFromCanvasV2(treeNode: TreeNodeType){
		if(treeNode.children && treeNode.children?.length -1 > 0){
			const dataObjects = gatherDataObjects(treeNode.children)
			const indicies = dataObjects.map((dataObject) => findObjectIndexInStore(dataObject))
			store.selectedDataObjects = store.selectedDataObjects.filter((_, index) => !indicies.includes(index))
		}
	}

	function hasAllChildrenSelected(children: TreeNodeType[]){
		const dataObjects = gatherDataObjects(children)
		return dataObjects.every((dataObject) => store.selectedDataObjects.some((o) =>  o.id === dataObject.id))
	}



	// #region Store Functions

	function toggleObjectInStore(dataObject: ObjectNodeDataObject){
		const wantedDataObjectIndex = findObjectIndexInStore(dataObject)
		const objectAlreadySelected = wantedDataObjectIndex !== -1
		if(objectAlreadySelected){
			store.selectedDataObjects.splice(wantedDataObjectIndex, 1)
		}else{
			store.selectedDataObjects.push(dataObject)
		}
	}

	function ensureObjectIsInStore(dataObject: ObjectNodeDataObject){
		const wantedDataObjectIndex = findObjectIndexInStore(dataObject)
		const objectAlreadySelected = wantedDataObjectIndex !== -1
		if(objectAlreadySelected){ return }
	
		store.selectedDataObjects.push(dataObject)
	}

	function findObjectIndexInStore(dataObject: ObjectNodeDataObject){
		return store.selectedDataObjects.findIndex( o => o.id === dataObject.id)
	}

</script>

