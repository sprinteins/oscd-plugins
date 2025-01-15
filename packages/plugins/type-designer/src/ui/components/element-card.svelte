<script lang="ts">
// STORE
import { dndStore } from '@/headless/stores/dnd.svelte'
import { elementTypesStore } from '@/headless/stores/element-types.svelte'
import { sidebarStore } from '@/headless/stores/sidebar.svelte'
// COMPONENTS
import { fade } from 'svelte/transition'
import {
	Card,
	Collapsible,
	Button,
	Sidebar,
	Badge
} from '@oscd-plugins/core-ui-svelte'
import { Diamond, DiamondPlus, ChevronRight, ChevronDown } from 'lucide-svelte'
// TYPES
import type {
	ElementType,
	Columns,
	AvailableFamilies
} from '@/headless/stores/types.element-types'
//======= INITIALIZATION =======//

const {
	columnKey,
	elementTypeKey,
	elementTypeFamily,
	elementType
}: {
	columnKey: keyof Columns
	elementTypeKey: string
	elementTypeFamily: AvailableFamilies | 'lNodeType'
	elementType: ElementType<typeof elementTypeFamily>
} = $props()

let isOpen = $state(false)

const sidebar = Sidebar.useSidebar()

const currentColumnFamilies = $derived(
	Object.keys(elementTypesStore.columns[columnKey].groupedElementTypes)
)
const isCurrentItemDragged = $derived(
	dndStore.currentDraggedElementTypeKey === elementTypeKey
)
const isCurrentItemFromCurrentColumn = $derived.by(() => {
	if (dndStore.currentSourceFamilyKey === 'lNodeType') return false
	return (
		dndStore.currentSourceFamilyKey &&
		currentColumnFamilies.includes(dndStore.currentSourceFamilyKey)
	)
})

const isAllowedToDrop = $derived.by(() => {
	if (columnKey && dndStore.currentSourceFamilyKey)
		return elementTypesStore.allowedTargetsByFamily[
			dndStore.currentSourceFamilyKey
		].includes(columnKey)
})

const currentItemName = $derived.by(() => {
	if (dndStore.currentSourceFamilyKey === 'lNodeType')
		return (
			dndStore.currentDraggedElementTypeKey &&
			elementTypesStore.lNodeTypeElementTypes[
				dndStore.currentDraggedElementTypeKey
			].name
		)

	return (
		dndStore.currentSourceFamilyKey &&
		dndStore.currentDraggedElementTypeKey &&
		elementTypesStore.elementTypesPerFamily[
			dndStore.currentSourceFamilyKey
		][dndStore.currentDraggedElementTypeKey].name
	)
})

const mappedTypeRefs = $derived.by(() => {
	if (elementType.typeRefs.length) {
		return elementType.typeRefs.reduce(
			(
				accumulator: ElementType<AvailableFamilies | 'lNodeType'>[],
				uuid: string
			) => {
				for (const column of Object.values(elementTypesStore.columns)) {
					for (const elementTypes of Object.values(
						column.groupedElementTypes
					)) {
						if (elementTypes[uuid]) {
							accumulator.push(elementTypes[uuid])
							break
						}
					}
				}
				return accumulator
			},
			[]
		)
	}

	return []
})

//======= FUNCTIONS =======//

function handleCardClick() {
	if (sidebarStore.currentElementTypeKey === elementTypeKey) {
		sidebarStore.resetCurrentElementType()
		return sidebar.setOpen(false)
	}

	sidebarStore.setCurrentElementType({
		key: elementTypeKey,
		family: elementTypeFamily,
		element: elementType
	})
	sidebar.setOpen(true)
}
</script>
	
<!-- <div use:useDnD> -->
<Collapsible.Root bind:open={isOpen} class="space-y-2">
	<Card.Root 
		class="mb-2"
		onclick={handleCardClick}
		draggable={true} 
		ondragstart={(event) => dndStore.handleDragStart(event, elementTypeKey, elementTypeFamily)} 
		ondragend={(event) => dndStore.handleDragEnd(event)}
	>
		<Card.Content class="flex flex-row items-center pl-2 h-14 cursor-grab">

			{#if elementType.typeRefs?.length}
				<Collapsible.Trigger
					class={Button.buttonVariants({ variant: "ghost", size: "icon", class: "size-9 p-0" })}
				>
					{#if isOpen}
						<ChevronDown class="!size-6"/>
					{:else}
						<ChevronRight class="!size-6"/>
					{/if}
				<span class="sr-only">Toggle</span>
				</Collapsible.Trigger>
			{:else}
				<Button.Root variant="ghost" class="size-9 p-0" disabled>
					<ChevronRight class="!size-6 opacity-40"/>
				</Button.Root>
			{/if}
			
			<DiamondPlus strokeWidth={3} class="text-teal-700 min-w-5 size-5 ml-1"/>
			<span class="ml-6 truncate">{ elementType.name }</span>
		</Card.Content>
	</Card.Root>
	
	<Collapsible.Content  class="space-y-2 flex flex-col items-end">
		{#snippet child({ props, open })}
			{#if open}
				<div {...props} transition:fade>
					{#each mappedTypeRefs as typeRef}					
						<Card.Root class="w-5/6" >
							<Card.Content class="h-14 flex items-center">
								<Diamond strokeWidth={3} class="text-teal-700 min-w-5 size-5 ml-1"/>
								<span class="ml-4 truncate">Ref_{typeRef.name}</span>
							</Card.Content>
						</Card.Root>
					{/each}
				</div>
			{/if}
		{/snippet}
	</Collapsible.Content>

	{#if dndStore.isDragging && !isCurrentItemDragged && !isCurrentItemFromCurrentColumn && isAllowedToDrop}
		<div transition:fade class="flex justify-end">
			<Card.Root
				class="border-gray-500 border-dashed w-5/6"
				ondragover={(event) => dndStore.handleDragOver(event)}
				ondragleave={(event) => dndStore.handleDragLeave(event)}
				ondragenter={(event) => dndStore.handleDragEnter(event)}
				ondrop={(event) => dndStore.handleDrop({
					event,
					currentTargetColumnKey: columnKey,
					currentElementTypeFamily: elementTypeFamily,
					currentElementTypeKey: elementTypeKey
				})}
			>
				<Card.Content class="h-14 flex items-center justify-center">
					<span>Drop <i class="truncate">{currentItemName}</i> here</span>
				</Card.Content>
			</Card.Root>
		</div>
	{/if}


</Collapsible.Root>