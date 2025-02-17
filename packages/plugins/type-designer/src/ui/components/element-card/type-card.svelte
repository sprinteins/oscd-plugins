<script lang="ts">
// STORE
import { dndStore, sidebarStore, typeElementsStore } from '@/headless/stores'
// CONSTANTS
import { REF_FAMILY_MAP, TYPE_FAMILY_MAP } from '@/headless/constants'
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
	typeElement,
	isElementCardOpen
}: {
	typeElementKey: string
	typeElementFamily: AvailableTypeFamily
	typeElement: TypeElement<typeof typeElementFamily>
	isElementCardOpen: boolean
} = $props()

// actions
const sidebar = Sidebar.useSidebar()

//======= DERIVED STATES =======//

const typeRefFamily = $derived(
	typeElementFamily !== TYPE_FAMILY_MAP.bay &&
		typeElementsStore.getRefFamilyFromTypeFamily(
			typeElementFamily,
			typeElementKey
		)
)

const hasCurrentTypeElementRefs = $derived.by(() => {
	return Object.values(typeElement.refs).some(
		(ref) => Object.keys(ref).length
	)
})

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

<Card.Root 
	class={`mb-2 ${sidebarStore.currentElementTypeKey === typeElementKey ? 'border-primary ring ring-primary ring-offset-2 ring-offset-primary-foreground' : ''}`}
	onclick={handleCardClick}
	draggable={typeElementFamily !== TYPE_FAMILY_MAP.bay ? true : false} 
	ondragstart={(event) => typeRefFamily && dndStore.handleDragStart({
		event,
		sourceTypeId: typeElementKey,
		sourceFamilyKey: typeElementFamily,
		sourceRefFamily: typeRefFamily
	})} 
	ondragend={(event) => dndStore.handleDragEnd(event)}
>
	<Card.Content class={`flex flex-row items-center justify-between h-14 ${cursorPointer} ${typeElementFamily === TYPE_FAMILY_MAP.lNodeType ? 'px-6' : 'px-2'}`}>

		<div class="flex items-center min-w-0">
			{#if typeElementFamily !== TYPE_FAMILY_MAP.lNodeType }
				{#if hasCurrentTypeElementRefs}
					<Collapsible.Trigger
						onclick={(event) => event.stopPropagation()}
						class={Button.buttonVariants({ variant: "ghost", class: "size-10 rounded-full p-0 mr-2" })}
					>
						{#if isElementCardOpen}
							<ChevronDown class="!size-6"/>
						{:else}
							<ChevronRight class="!size-6"/>
						{/if}
					<span class="sr-only">Toggle</span>
					</Collapsible.Trigger>
				{:else}
					<Button.Root variant="ghost" class="size-10 rounded-full p-0 mr-2" disabled >
						<ChevronRight class="!size-6 opacity-40"/>
					</Button.Root>
				{/if}
			{/if}
			<div class="min-w-3 min-h-3 bg-teal-700 transform rotate-45"></div>
			
			<div class="ml-6 truncate capitalize">{ typeElement.parameters.label }</div>
			{#if typeRefFamily === REF_FAMILY_MAP.eqFunction}
				<Badge.Root class="ml-3 bg-gray-300 rounded-sm text-gray-600 hover:bg-gray-300">EQ</Badge.Root>
			{/if}
		</div>
		
		{#if typeElementFamily !== TYPE_FAMILY_MAP.lNodeType }
			<CardMenu type={{ family: typeElementFamily, id: typeElementKey }}/>
		{/if}
	</Card.Content>
</Card.Root>
