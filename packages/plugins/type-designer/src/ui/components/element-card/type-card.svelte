<script lang="ts">
// STORE
import { dndStore, sidebarStore } from '@/headless/stores'
// CONSTANTS
import { REF_FAMILY, TYPE_FAMILY } from '@/headless/constants'
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
	typeElement: TypeElement<AvailableTypeFamily>
	isElementCardOpen: boolean
} = $props()

// actions
const sidebar = Sidebar.useSidebar()

//======= DERIVED STATES =======//

const hasCurrentTypeElementRefs = $derived.by(() => {
	return Object.values(typeElement.refs).some(
		(ref) => Object.keys(ref).length
	)
})

const cursorPointer = $derived.by(() => {
	if (typeElementFamily === TYPE_FAMILY.bay) return 'cursor-pointer'
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
	draggable={typeElementFamily !== TYPE_FAMILY.bay ? true : false} 
	ondragstart={(event) => dndStore.handleDragStart({
		event,
		sourceTypeId: typeElementKey,
		sourceTypeFamily: typeElementFamily,
		sourceRefFamily: typeElement.parameters.refFamily
	})} 
	ondragend={() => dndStore.handleDragEnd()}
>
	<Card.Content class={`flex flex-row items-center justify-between h-8 p-2 ${cursorPointer} ${typeElementFamily === TYPE_FAMILY.lNodeType ? 'px-4' : 'px-1'}`}>

		<div class="flex items-center min-w-0">
			{#if typeElementFamily !== TYPE_FAMILY.lNodeType }
				{#if hasCurrentTypeElementRefs}
					<Collapsible.Trigger
						onclick={(event) => event.stopPropagation()}
						class={Button.buttonVariants({ variant: "ghost", class: "size-7 rounded-full p-0 mr-2" })}
					>
						{#if isElementCardOpen}
							<ChevronDown class="!size-5"/>
						{:else}
							<ChevronRight class="!size-5"/>
						{/if}
					<span class="sr-only">Toggle</span>
					</Collapsible.Trigger>
				{:else}
					<Button.Root variant="ghost" class="size-7 rounded-full p-0 mr-2" disabled >
						<ChevronRight class="!size-5 opacity-40"/>
					</Button.Root>
				{/if}
			{/if}
			<div class="min-w-2.5 min-h-2.5 bg-teal-700 transform rotate-45"></div>
			
			<div class="ml-6 truncate capitalize">{ typeElement.parameters.label }</div>
			{#if typeElement.parameters.refFamily === REF_FAMILY.eqFunction}
				<Badge.Root class="ml-3 bg-gray-300 rounded-sm text-gray-600 hover:bg-gray-300">EQ</Badge.Root>
			{/if}
			{#if typeElement.parameters.refFamily === REF_FAMILY.function}
				<Badge.Root class="ml-3 bg-gray-300 rounded-sm text-gray-600 hover:bg-gray-300">FN</Badge.Root>
			{/if}
		</div>
		
		{#if typeElementFamily !== TYPE_FAMILY.lNodeType }
			<CardMenu type={{ family: typeElementFamily, id: typeElementKey }}/>
		{/if}
	</Card.Content>
</Card.Root>
