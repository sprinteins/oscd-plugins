<script lang="ts">
// STORE
import { dndStore, typeElementsStore, importsStore } from '@/headless/stores'
// CONSTANTS
import {
	TYPE_FAMILY,
	REF_FAMILY,
	ALLOWED_TARGETS_BY_REF_FAMILY
} from '@/headless/constants'
// COMPONENTS
import { slide } from 'svelte/transition'
import { Card, Collapsible, Badge } from '@oscd-plugins/core-ui-svelte'
import TypeCard from './type-card.svelte'
import CardMenu from './card-menu.svelte'
import { CirclePlus } from 'lucide-svelte'
// TYPES
import type {
	TypeElement,
	AvailableTypeFamily,
	AvailableRefFamily,
	RefElementByIds,
	RefElement,
	ImportScope
} from '@/headless/stores'

//======= INITIALIZATION =======//

// props
const {
	typeElementKey,
	typeElementFamily,
	typeElement,
	importScope,
	isLast,
	columnContentElement
}: {
	typeElementKey: string
	typeElementFamily: AvailableTypeFamily
	typeElement: TypeElement<AvailableTypeFamily>
	importScope?: ImportScope
	isLast?: boolean
	columnContentElement?: HTMLElement | null
} = $props()

// local states
let isElementCardOpen = $state(false)
let isCurrentDropTarget = $state(false)

//======= DERIVED STATES =======//

const isLNodeType = $derived(typeElementFamily === TYPE_FAMILY.lNodeType)

const currentRefs = $derived.by(() => {
	if (importScope)
		return Object.entries(
			importsStore.loadedTypeElementsPerFamily[typeElementFamily].raw[
				typeElementKey
			].refs
		) as [AvailableRefFamily, RefElementByIds<AvailableRefFamily>][]

	return Object.entries(typeElement.refs) as [
		AvailableRefFamily,
		RefElementByIds<AvailableRefFamily>
	][]
})

const hasRefs = $derived.by(() => {
	return Object.values(typeElement.refs).some(
		(ref) => Object.keys(ref).length
	)
})

const isAllowedToDrop = $derived.by(() => {
	if (dndStore.currentSourceRefFamily)
		return ALLOWED_TARGETS_BY_REF_FAMILY[
			dndStore.currentSourceRefFamily
		].some(
			(allowedTargetFamily) => allowedTargetFamily === typeElementFamily
		)
	// is undefined for template functions (not instantiated)
	if (dndStore.currentSourceTypeFamily === TYPE_FAMILY.function)
		return (
			typeElementFamily === TYPE_FAMILY.bay ||
			typeElementFamily === TYPE_FAMILY.generalEquipment ||
			typeElementFamily === TYPE_FAMILY.conductingEquipment
		)
	return false
})

//======= FUNCTIONS =======//

function getCurrentRefFullLabel(refWrapper: RefElement<AvailableRefFamily>) {
	let currentLabel: string
	if (importScope)
		currentLabel =
			importsStore.loadedTypeElementsPerFamily[refWrapper.source.family]
				.all[refWrapper.source.id].parameters.label
	else
		currentLabel =
			typeElementsStore.typeElementsPerFamily[refWrapper.source.family][
				refWrapper.source.id
			].parameters.label

	return `${currentLabel}_Ref_${refWrapper.occurrence}`
}

//======= LOCAL DND HANDLERS =======//

function shouldShowBadge(refFamily: AvailableRefFamily) {
	return (
		refFamily === REF_FAMILY.conductingEquipment ||
		refFamily === REF_FAMILY.generalEquipment ||
		refFamily === REF_FAMILY.function
	)
}

function getBadgeLabel(refFamily: AvailableRefFamily) {
	if (
		refFamily === REF_FAMILY.conductingEquipment ||
		refFamily === REF_FAMILY.generalEquipment
	)
		return 'Eq'
	if (refFamily === REF_FAMILY.function) return 'Fn'
}

const handleDragOver = (event: DragEvent) => {
	event.preventDefault()
	if (!isAllowedToDrop) return
	isCurrentDropTarget = true
}

const handleDragLeave = (event: DragEvent) => {
	const dropZone = event.currentTarget as HTMLElement
	if (!dropZone?.contains(event.relatedTarget as Node | null)) {
		isCurrentDropTarget = false
	}
}

const handleDrop = (event: DragEvent) => {
	event.preventDefault()
	if (!isAllowedToDrop) return
	isCurrentDropTarget = false
	dndStore.handleDrop({
		parentTypeWrapper: typeElement.element,
		parentTypeFamily: typeElementFamily
	})
}

//======= EFFECTS =======//

// handle last element with drag and drop
// to scroll the column content element to bottom
$effect(() => {
	if (isElementCardOpen && isLast && columnContentElement)
		columnContentElement.scrollTo({
			top: columnContentElement.scrollHeight,
			behavior: 'smooth'
		})
})
</script>

<Collapsible.Root
	bind:open={isElementCardOpen}
	class="space-y-1 mb-2"
>
	<!-- svelte-ignore a11y_no_static_element_interactions -->
	<div
		class="relative"
		ondragover={importScope ? undefined : handleDragOver}
		ondragleave={importScope ? undefined : handleDragLeave}
		ondrop={importScope ? undefined : handleDrop}
	>
		<TypeCard {typeElement} {typeElementKey} {typeElementFamily} {isElementCardOpen} {importScope} />
		{#if isCurrentDropTarget && isAllowedToDrop}
			<div class="absolute inset-0 rounded-lg border-2 border-primary ring-2 ring-primary ring-offset-1 pointer-events-none"></div>
			<CirclePlus class="absolute right-2 top-1.5 size-5 text-primary animate-pulse pointer-events-none" />
		{/if}
	</div>

	<Collapsible.Content class="space-y-1 flex flex-col items-end">
		{#snippet child({ props, open: collapsibleContentOpen })}
			{#if collapsibleContentOpen}
				<div {...props} transition:slide={{ duration: 100 }}>
					<!-- REFS CARDS START -->
					{#if typeElementFamily !== TYPE_FAMILY.lNodeType}
						{#each currentRefs as [refFamily, refElements]}
							{#each Object.entries(refElements) as [refId, refWrapper]}
								<Card.Root class="w-5/6">
									<Card.Content class="h-8 p-1 flex items-center justify-between">
										<div class="flex items-center min-w-0 w-full">
											<span class="ml-3 min-w-2.5 min-h-2.5 border-teal-700 border-2 transform rotate-45"></span>
											<span class="ml-4 truncate">{ getCurrentRefFullLabel(refWrapper) }</span>
											{#if shouldShowBadge(refFamily)}
												<Badge.Root class="bg-transparent border-gray-600 border-2 rounded-sm text-gray-600 hover:bg-transparent ml-auto">{ getBadgeLabel(refFamily) }</Badge.Root>
											{/if}
										</div>
										{#if !importScope}
											<CardMenu type={{ family: typeElementFamily, id: typeElementKey}} ref={{ family: refFamily, id: refId}}/>
										{/if}
									</Card.Content>
								</Card.Root>
							{/each}
						{/each}
					{/if}
					<!-- REFS CARDS END -->
				</div>
			{/if}
		{/snippet}
	</Collapsible.Content>
</Collapsible.Root>