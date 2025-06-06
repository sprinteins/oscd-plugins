<script lang="ts">
// STORE
import { dndStore, sidebarStore } from '@/headless/stores'
// CONSTANTS
import { REF_FAMILY, TYPE_FAMILY } from '@/headless/constants'
// STORES
import { importsStore } from '@/headless/stores'
// COMPONENTS
import {
	Card,
	Collapsible,
	Button,
	Sidebar,
	Badge
} from '@oscd-plugins/core-ui-svelte'
import {
	ChevronRight,
	ChevronDown,
	CircleArrowDown,
	RefreshCcw
} from 'lucide-svelte'
import CardMenu from './card-menu.svelte'
// TYPES
import type {
	TypeElement,
	AvailableTypeFamily,
	ImportScope
} from '@/headless/stores'

//======= INITIALIZATION =======//

// props
const {
	typeElementKey,
	typeElementFamily,
	typeElement,
	isElementCardOpen,
	importScope
}: {
	typeElementKey: string
	typeElementFamily: AvailableTypeFamily
	typeElement: TypeElement<AvailableTypeFamily>
	isElementCardOpen: boolean
	importScope?: ImportScope
} = $props()

// actions
const sidebar = Sidebar.useSidebar()

//======= DERIVED STATES =======//

const shouldShowBadge = $derived(
	typeElement.parameters.refFamily === REF_FAMILY.eqFunction ||
		typeElement.parameters.refFamily === REF_FAMILY.function
)

const hasCurrentTypeElementRefs = $derived.by(() => {
	return Object.values(typeElement.refs).some(
		(ref) => Object.keys(ref).length
	)
})

const cursorPointer = $derived.by(() => {
	if (dndStore.isDragging) return 'cursor-grabbing'
	if (isDraggable) return 'cursor-grab'
	return 'cursor-pointer'
})

const isDraggable = $derived.by(() => {
	if (typeElementFamily === TYPE_FAMILY.bay || importScope) return false
	return true
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
		element: typeElement,
		isImported: !!importScope
	})
	sidebar.setOpen(true)
}

async function handleImport(event: Event) {
	event.stopPropagation()

	await importsStore.handleImportsAndFireDialogDecision(
		typeElementKey,
		typeElementFamily
	)
}

function getBadgeLabel(refFamily: string | undefined) {
	if (refFamily === REF_FAMILY.eqFunction) return 'EqFn'
	if (refFamily === REF_FAMILY.function) return 'Fn'
}
</script>

<Card.Root 
	class={`mb-1 ${sidebarStore.currentElementTypeKey === typeElementKey ? 'border-primary ring ring-primary ring-offset-2 ring-offset-primary-foreground' : ''}`}
	onclick={handleCardClick}
	draggable={isDraggable} 
	ondragstart={(event) => dndStore.handleDragStart({
		event,
		sourceTypeId: typeElementKey,
		sourceTypeFamily: typeElementFamily,
		sourceRefFamily: typeElement.parameters.refFamily
	})} 
	ondragend={() => dndStore.handleDragEnd()}
>
	<Card.Content class={`flex flex-row items-center justify-between h-8 p-2 ${cursorPointer} ${typeElementFamily === TYPE_FAMILY.lNodeType ? 'pl-4 pr-1' : 'px-1'}`}>

		<div class="flex items-center min-w-0 w-full">
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

			<!-- FUNCTION BADGES START -->
			{#if shouldShowBadge}
				<Badge.Root class="bg-gray-300 rounded-sm text-gray-600 hover:bg-gray-300 ml-auto">{ getBadgeLabel(typeElement.parameters.refFamily) }</Badge.Root>
			{/if}
			<!-- FUNCTION BADGES END -->
		</div>

		<!-- CARD MENU START -->
		{#if importScope}
			<Button.Root variant="ghost" class="rounded-full p-0 size-7 ml-2" onclick={async (event) => await handleImport(event)}>
				{#if importScope === 'toAdd'}
					<CircleArrowDown class="!size-5"/>
				{:else if importScope === 'toUpdate'}
					<RefreshCcw class="!size-5"/>
				{/if}
			</Button.Root>
		{:else if typeElementFamily !== TYPE_FAMILY.lNodeType }
			<CardMenu type={{ family: typeElementFamily, id: typeElementKey }}/>
		{/if}
		<!-- CARD MENU END -->
	</Card.Content>
</Card.Root>
