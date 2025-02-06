<script lang="ts">
// STORE
import { dndStore, sidebarStore, typeElementsStore } from '@/headless/stores'
// CONSTANTS
import { TYPE_FAMILY_MAP } from '@/headless/constants'
// COMPONENTS
import {
	Card,
	Collapsible,
	Button,
	Sidebar,
	Badge
} from '@oscd-plugins/core-ui-svelte'
import { ChevronRight, ChevronDown } from 'lucide-svelte'
import CardMenu from './card-menu.svelte'
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

const cursorPointer = $derived.by(() => {
	if (typeElementFamily === TYPE_FAMILY_MAP.bay) return 'cursor-pointer'
	if (dndStore.isDragging) return 'cursor-grabbing'
	return 'cursor-grab'
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
		<Card.Content class={`flex flex-row items-center justify-between px-2 h-14 ${cursorPointer}`}>

			<div class="flex items-center min-w-0">
				{#if typeElementFamily !== TYPE_FAMILY_MAP.lNodeType }
					{#if Object.keys(typeElement.refs)?.length}
						<Collapsible.Trigger
							onclick={(event) => event.stopPropagation()}
							class={Button.buttonVariants({ variant: "ghost", class: "h-10 p-0 mr-2 rounded-full" })}
						>
							{#if isElementCardOpen}
								<ChevronDown class="!size-6"/>
							{:else}
								<ChevronRight class="!size-6"/>
							{/if}
						<span class="sr-only">Toggle</span>
						</Collapsible.Trigger>
					{:else}
						<Button.Root variant="ghost" class="h-10 p-0 mr-2 rounded-full" disabled >
							<ChevronRight class="!size-6 opacity-40"/>
						</Button.Root>
					{/if}
				{/if}
				<div class="min-w-3 min-h-3 bg-teal-700 transform rotate-45"></div>
				
				<div class="ml-6 truncate capitalize">{ typeElement.parameters.label }</div>
				{#if typeRefFamily === 'eqFunction'}
					<Badge.Root class="ml-3 bg-gray-300 rounded-sm text-gray-600 hover:bg-gray-300">EQ</Badge.Root>
				{/if}
			</div>
			
			{#if typeElementFamily !== TYPE_FAMILY_MAP.lNodeType }
				<CardMenu level="type" family={typeElementFamily} id={typeElementKey}/>
			{/if}
		</Card.Content>
	</Card.Root>
	<!-- TYPE CARD END -->