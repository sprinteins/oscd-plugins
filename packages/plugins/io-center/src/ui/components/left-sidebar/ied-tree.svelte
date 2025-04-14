<script lang="ts">
// STORES
import { iedTreeStore } from '@/headless/stores'
// COMPONENTS
import { Tree } from 'melt/builders'
import {
	ChevronRight,
	ChevronDown,
	Square,
	SquareCheck,
	SquareMinus
} from 'lucide-svelte'
import { NODE_TYPE } from '@/headless/constants'

//====== DERIVED ======//

const tree = $derived(
	new Tree({ items: iedTreeStore.filteredTreeItems, multiple: false })
)
</script>


{#snippet treeItemChevron(item: typeof tree['children'][number])}
	{#if item.expanded}
		<ChevronDown size={14} />
		{:else}
		<ChevronRight size={14} class={!item.children?.length ? 'invisible' : '' } />
	{/if}
{/snippet}

{#snippet treeItemCheckbox(item: typeof tree['children'][number])}
	{#if item.item?.level === NODE_TYPE.dO && item.id === iedTreeStore.selectedDataObject?.id}
		<SquareCheck size={14} class="ml-auto"/>
	{:else if item.item?.children && iedTreeStore.hasSelectedChild(item.item.children)}
		<SquareMinus size={14} class="ml-auto"/>
	{:else if item.item?.level === NODE_TYPE.dO}
		<Square size={14} class="ml-auto invisible group-hover:visible"/>
	{/if}
{/snippet}

{#snippet treeItems(items: typeof tree['children'], depth: number = 0)}
	{#each items as treeItem (treeItem.id)}
		<li
			{...treeItem.attrs}
			class="cursor-pointer !outline-none first:mt-0 [&:focus-visible>:first-child>div]:ring-4"
		>
			<button class="w-full group py-1" style="padding-left: {depth * 1}rem" onclick={() => iedTreeStore.handleSelectDataObject(treeItem.item)}>
				<div
					class="
					{treeItem.selected
						? 'bg-accent text-accent-foreground font-black'
						: ''}
					{iedTreeStore.isSearched(treeItem.item)
						? 'bg-muted/50 hover:bg-muted'
						: ''}
					ring-primary flex h-full w-full items-center gap-2
					px-3 py-1 ring-offset-transparent transition group-hover:bg-accent"
				>
					{@render treeItemChevron(treeItem)}
					<span>{treeItem.item.name}</span>
					{@render treeItemCheckbox(treeItem)}
				</div>
			</button >
			{#if treeItem.children?.length && treeItem.expanded}
				<div class="relative list-none p-0 {!treeItem.expanded ? 'pointer-events-none' : ''} origin-left">
					<div
						class="absolute bottom-2 top-2 w-px bg-muted "
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
