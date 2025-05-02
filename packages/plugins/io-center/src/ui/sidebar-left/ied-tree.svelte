<script lang="ts">
// STORES
import { iedStore } from '@/headless/stores'
// COMPONENTS
import { Tree } from 'melt/builders'
import {
	ChevronRight,
	ChevronDown,
	Square,
	SquareCheck,
	SquareMinus
} from 'lucide-svelte'
import { TREE_LEVEL } from '@/headless/constants'

//====== DERIVED ======//

const tree = $derived(
	new Tree({ items: iedStore.filteredTreeItems, multiple: false })
)

//====== FUNCTIONS ======//

function handleTreeItemClick(treeItem: (typeof tree)['children'][number]) {
	if (!iedStore.isDataObject(treeItem.item)) return

	const lN = treeItem.parent as (typeof tree)['children'][number]
	const lDevice = lN.parent as (typeof tree)['children'][number]
	const accessPoint = lDevice.parent as (typeof tree)['children'][number]

	iedStore.handleSelectDataObject({
		dataObject: treeItem.item,
		parentTreeItemToExpandOnUpdate: {
			lN: lN.id,
			lDevice: lDevice.id,
			accessPoint: accessPoint.id
		}
	})
}

//====== EFFECTS ======//

$effect(() => {
	if (
		!iedStore.selectedDataObject ||
		!iedStore.parentTreeItemToExpandOnUpdate
	)
		return

	tree.expand(iedStore.parentTreeItemToExpandOnUpdate.accessPoint)
	tree.expand(iedStore.parentTreeItemToExpandOnUpdate.lDevice)
	tree.expand(iedStore.parentTreeItemToExpandOnUpdate.lN)
	if (!tree.isSelected(iedStore.selectedDataObject.id)) {
		tree.select(iedStore.selectedDataObject.id)
	}
})
</script>

{#snippet treeItemChevron(item: typeof tree['children'][number])}
	{#if item.expanded}
		<ChevronDown class="size-4" />
		{:else}
		<ChevronRight class={!item.children?.length ? 'invisible size-5' : 'size-4' } />
	{/if}
{/snippet}

{#snippet treeItemCheckbox(item: typeof tree['children'][number])}
	{#if item.item?.level === TREE_LEVEL.dO && item.id === iedStore.selectedDataObject?.id}
		<SquareCheck class="ml-auto size-4"/>
	{:else if item.item?.children && iedStore.hasSelectedChild(item.item.children)}
		<SquareMinus class="ml-auto size-4"/>
	{:else if item.item?.level === TREE_LEVEL.dO}
		<Square class="ml-auto invisible group-hover:visible size-4"/>
	{/if}
{/snippet}

{#snippet treeItems(items: typeof tree['children'], depth: number = 0)}
	{#each items as treeItem (treeItem.id)}
		<li
			{...treeItem.attrs}
			class="cursor-pointer !outline-none first:mt-0 [&:focus-visible>:first-child>div]:ring-4 space-y-1"
		>
			<button
				class="w-full group"
				style="padding-left: {depth * 1}rem"
				onclick={() => handleTreeItemClick(treeItem)}
				onselect={() => handleTreeItemClick(treeItem)}
			>
				<div
					class="
					{treeItem.selected
						? 'bg-accent text-accent-foreground font-black'
						: ''}
					{iedStore.isSearched(treeItem.item)
						? 'bg-muted/50 hover:bg-muted'
						: ''}
					ring-primary flex h-10 rounded-md w-full items-center gap-2 px-3 ring-offset-transparent transition group-hover:bg-accent"
				>
					{@render treeItemChevron(treeItem)}
					<span>{treeItem.item.name}</span>
					{@render treeItemCheckbox(treeItem)}
				</div>
			</button >
			{#if treeItem.children?.length && treeItem.expanded}
				<div class="relative list-none p-0 {!treeItem.expanded ? 'pointer-events-none' : ''} origin-left">
					<div
						class="absolute bottom-2 top-2 w-px bg-muted"
						style="left: {1 + depth * 1}rem"
					></div>
					{@render treeItems(treeItem.children, depth + 1)}
				</div>
			{/if}
		</li>
	{/each}
{/snippet}
	

<ul class="mx-auto list-none" {...tree.root}>
	{@render treeItems(tree.children, 0)}
</ul>
