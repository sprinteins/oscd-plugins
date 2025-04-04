<script lang="ts">
import TreeNode from './tree-node.svelte'
import type { TreeNode as TreeNodeType } from './types.object-tree'
import {
	ChevronRight,
	ChevronDown,
	Square,
	SquareCheck,
	SquareMinus
} from 'lucide-svelte'
import { store } from '../../../store.svelte'
import { gatherDataObjects } from './utils'

type Props = {
	treeNode: TreeNodeType
	searchTerm: string
	onclickobjectcheckbox?: (node: TreeNodeType) => void
	onclickobject?: (node: TreeNodeType) => void
	onclickparentcheckbox?: (node: TreeNodeType) => void
	onclickparentnode?: (node: TreeNodeType) => void
}

let {
	treeNode,
	searchTerm,
	onclickobjectcheckbox = noopFn,
	onclickobject = noopFn,
	onclickparentcheckbox = noopFn,
	onclickparentnode = noopFn
}: Props = $props()

function noopFn() {}

let isSearched = $derived(
	searchTerm !== '' &&
		treeNode.name.toLowerCase().includes(searchTerm.toLowerCase())
)

let isSelected = $derived(store.selectedDataObject?.id === treeNode.id)

/* 	function hasAllChildrenSelected(children: TreeNodeType[]){
		const dataObjects = gatherDataObjects(children)
		if(dataObjects.length === 0){
			return false
		}
		return dataObjects.every((dataObject) => store.selectedDataObjects.some((o) => o.id === dataObject.id));
	} */

function hasSomeSelectedChildren(children: TreeNodeType[]) {
	const dataObjects = gatherDataObjects(children)
	if (dataObjects.length === 0) {
		return false
	}
	return dataObjects.some(
		(child) => store.selectedDataObject?.id === child.id
	)
}

function disableClick(e: MouseEvent) {
	e.stopPropagation()
	e.preventDefault()
}
</script>

<div class="tree-node">
    {#if treeNode.children}
        <details open={treeNode.isOpen}>
            <summary
                class={{
					"tree-summary": true,
					"selected": isSelected,
				 	"searched": isSearched,
				}}
				onclick={disableClick}
            >
				<button 
					onclick={(e) => onclickparentnode(treeNode)}
					class="tree-summary-button"
				>
					<span>
						{#if treeNode.isOpen}
							<ChevronDown size={14} />
						{:else}
							<ChevronRight size={14} />
						{/if}
					</span>
	
					<p class="text-sm font-medium">
						{treeNode.name}
					</p>

				</button>
				
				<button class="tree-select-all" onclick={() => onclickparentcheckbox(treeNode)}>
<!-- 				{#if hasAllChildrenSelected(treeNode.children)}
						<SquareCheck size={16}/> -->
					{#if hasSomeSelectedChildren(treeNode.children)}
						<SquareMinus size={16}/>
					{:else}
						<span class="show-on-hover">
							<Square size={16}/>
						</span>
					{/if}
				</button>

            </summary>
            <div class="tree-details">
                {#each treeNode.children as node, index (node.id + index)}
                    <TreeNode
                        treeNode={node}
						{searchTerm}
                        {onclickobjectcheckbox}
						{onclickobject}
						{onclickparentcheckbox}
						{onclickparentnode}
                    />
                {/each}
            </div>
        </details>

    {:else}
		<div class={{
			"object": true, 
			"selected": isSelected, 
			"searched": isSearched,
		}}>
			<button
				class="p-2 w-full text-sm text-left flex items-center gap-1"
				onclick={() => onclickobject(treeNode)}
			>
				{treeNode.name}
			</button>
			<button class="select-button" onclick={() => onclickobjectcheckbox(treeNode)}>	
				{#if isSelected}
					<SquareCheck size={16}/>
				{:else}
					<span class="show-on-hover">
						<Square size={16} />	
					</span>
				{/if}
			</button>
		</div>
    {/if}
</div>

<style lang="scss">
    .tree-node {
        user-select: none;
        -webkit-user-select: none;
		@apply font-mono cursor-pointer rounded-md  transition-colors duration-300 hover:no-underline;
    }
	.tree-summary{
		display: grid;
		grid-template-columns: 1fr auto;
		align-items: center;
		justify-items: left;
		padding-left: 0.5rem;
		border-radius: 6px;
	}
	.tree-summary:hover{
		@apply bg-gray-100;
	}
	.tree-summary.selected{
		@apply bg-beige hover:bg-beige;
	}
	.tree-summary.searched{
		@apply bg-gray-200 hover:bg-gray-200;
	}
	
	.tree-summary-button{
		width: 100%;
		display: grid;
		grid-template-columns: auto 1fr;
		align-items: center;
		justify-items: start;
	}

	.tree-details{
		border-left: 1px gray solid;
		grid-column: span 2;
		margin-left: 0.9rem;
	}

	.tree-select-all{
		padding: 0.5rem 1rem;
		/* padding: 0 1rem; */
	}

	.object {
		display: grid;
		grid-template-columns: 1fr auto;
		place-items: center;
		border-radius: 6px;
	}
	.object:hover{
		@apply bg-gray-100;
	}
	.object.selected{
		@apply bg-white 
	}
	.object.searched{
		@apply bg-gray-200 
	}
	.select-button{
		padding: 0.25rem 1rem;
		/* padding: 0.5rem 1rem; */
	}

	.show-on-hover{
		opacity: 0.0;
	}
	.tree-summary:hover .tree-select-all:hover .show-on-hover,
	.object:hover .select-button:hover .show-on-hover{
		opacity: 1;
	}
	.tree-summary:hover .show-on-hover,
	.object:hover .show-on-hover{
		opacity: 0.2;
	}
</style>

