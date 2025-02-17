<script lang="ts">
// STORE
import { dndStore, sidebarStore, typeElementsStore } from '@/headless/stores'
// CONSTANTS
import {
	ALLOWED_TARGETS_BY_REF_FAMILY,
	TYPE_FAMILY_MAP
} from '@/headless/constants'
// COMPONENTS
import { fade } from 'svelte/transition'
import {
	Card,
	Collapsible,
	Button,
	Sidebar,
	Badge
} from '@oscd-plugins/core-ui-svelte'
import { ChevronRight, ChevronDown } from 'lucide-svelte'
// TYPES
import type { TypeElement, AvailableTypeFamily } from '@/headless/stores'

//======= INITIALIZATION =======//

// props
const {
	typeElementKey,
	typeElementFamily,
	typeElement
}: {
	typeElementKey: string
	typeElementFamily: AvailableTypeFamily
	typeElement: TypeElement<typeof typeElementFamily>
} = $props()

// actions
const sidebar = Sidebar.useSidebar()

// local states
let isElementCardOpen = $state(false)

//======= DERIVED STATES =======//

const typeRefFamily = $derived(
	typeElementsStore.getRefFamilyFromTypeFamily(
		typeElementFamily,
		typeElementKey
	)
)

const isAllowedToDrop = $derived.by(() => {
	if (dndStore.currentSourceRefFamily === 'genericFunction')
		return (
			typeElementFamily === TYPE_FAMILY_MAP.bay ||
			typeElementFamily === TYPE_FAMILY_MAP.generalEquipmentType ||
			typeElementFamily === TYPE_FAMILY_MAP.conductingEquipmentType
		)

	if (dndStore.currentSourceRefFamily)
		return ALLOWED_TARGETS_BY_REF_FAMILY[
			dndStore.currentSourceRefFamily
		].some(
			(allowedTargetFamily) => allowedTargetFamily === typeElementFamily
		)
})

const currentDraggedItemLabel = $derived(
	dndStore.currentSourceFamilyKey &&
		dndStore.currentSourceTypeIdOrUuid &&
		typeElementsStore.typeElementsPerFamily[
			dndStore.currentSourceFamilyKey
		][dndStore.currentSourceTypeIdOrUuid].parameters.label
)

const cursorPointer = $derived.by(() => {
	if (typeElementFamily === TYPE_FAMILY_MAP.bay) return 'cursor-pointer'
	if (dndStore.isDragging) return 'cursor-grabbing'
	return 'cursor-grab'
})

const sourceTypeFromRefs = $derived.by(() => {
	const refEntries = Object.entries(typeElement.refs) as [
		AvailableTypeFamily,
		string[]
	][]

	return refEntries.reduce((acc, [typeFamily, refs]) => {
		for (const ref of refs) {
			const typeElement =
				typeElementsStore.typeElementsPerFamily[typeFamily][ref]
			if (typeElement) acc.push(typeElement)
		}
		return acc
	}, [] as TypeElement<AvailableTypeFamily>[])
})

//======= FUNCTIONS =======//

function handleCardClick() {
	if (sidebarStore.currentElementTypeKey === typeElementKey) {
		sidebarStore.resetCurrentElementType()
		return sidebar.setOpen(false)
	}

	sidebarStore.setCurrentElementType({
		key: typeElementKey,
		family: typeElementFamily,
		element: typeElement
	})
	sidebar.setOpen(true)
}
</script>

<Collapsible.Root bind:open={isElementCardOpen} class="space-y-2">

	<!-- TYPE CARD START -->
	<Card.Root 
		class="mb-2"
		onclick={handleCardClick}
		draggable={typeElementFamily !== TYPE_FAMILY_MAP.bay ? true : false} 
		ondragstart={(event) => dndStore.handleDragStart({
			event,
			sourceTypeId: typeElementKey,
			sourceFamilyKey: typeElementFamily,
			sourceRefFamily: typeRefFamily
		})} 
		ondragend={(event) => dndStore.handleDragEnd(event)}
	>
		<Card.Content class={`flex flex-row items-center pl-2 h-14 ${cursorPointer}`}>

			{#if typeElementFamily !== TYPE_FAMILY_MAP.lNodeType }
				{#if Object.keys(typeElement.refs)?.length}
					<Collapsible.Trigger
						onclick={(event) => event.stopPropagation()}
						class={Button.buttonVariants({ variant: "ghost", size: "icon", class: "size-9 p-0 -mr-2" })}
					>
						{#if isElementCardOpen}
							<ChevronDown class="!size-6"/>
						{:else}
							<ChevronRight class="!size-6"/>
						{/if}
					<span class="sr-only">Toggle</span>
					</Collapsible.Trigger>
				{:else}
					<Button.Root variant="ghost" class="size-9 p-0 -mr-2" disabled >
						<ChevronRight class="!size-6 opacity-40"/>
					</Button.Root>
				{/if}
			{/if}
			<span class="ml-3 min-w-3 min-h-3 bg-teal-700 transform rotate-45"></span>
			
			<span class="ml-6 truncate capitalize">{ typeElement.parameters.label }</span>
			{#if typeRefFamily === 'eqFunction'}
				<Badge.Root class="ml-3 bg-gray-300 rounded-sm text-gray-600 hover:bg-gray-300">EQ</Badge.Root>
			{/if}
		</Card.Content>
	</Card.Root>
	<!-- TYPE CARD END -->


	<!-- REF CARD START -->
	<Collapsible.Content  class="space-y-2 flex flex-col items-end">
		{#snippet child({ props, open: collapsibleContentOpen })}
			{#if collapsibleContentOpen}
				<div {...props} transition:fade>
					{#each sourceTypeFromRefs as type}
							<Card.Root class="w-5/6" >
								<Card.Content class="h-14 flex items-center">
									<span class="min-w-3 min-h-3 border-teal-700 border-2 transform rotate-45"></span>
									<span class="ml-4 truncate">{ `Ref_${type?.parameters.label}` }</span>
								</Card.Content>
							</Card.Root>
						{/each}
				</div>
			{/if}
		{/snippet}
	</Collapsible.Content>
	<!-- REF CARD END -->

<!-- DND PLACEHOLDER START -->
	{#if dndStore.isDragging && isAllowedToDrop}
		<div transition:fade class="flex justify-end">
			<Card.Root
				class="border-gray-500 border-dashed w-5/6 "
				ondragover={(event) => dndStore.handleDragOver(event)}
				ondragleave={(event) => dndStore.handleDragLeave(event)}
				ondragenter={(event) => dndStore.handleDragEnter(event)}
				ondrop={(event) => dndStore.handleDrop(
					event,
					typeElement.element,
					typeElementFamily
				)}
			>
				<Card.Content class="h-14 flex items-center justify-center">
					<span>Drop <i class="truncate">{currentDraggedItemLabel}</i> here</span>
				</Card.Content>
			</Card.Root>
		</div>
	{/if}
	<!-- DND PLACEHOLDER END -->

</Collapsible.Root>