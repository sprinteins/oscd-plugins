<script lang="ts">
// CORE
import { typeGuard } from '@oscd-plugins/core-api/plugin/v1'
// STORE
import { dndStore, typeElementsStore, importsStore } from '@/headless/stores'
// CONSTANTS
import {
	TYPE_FAMILY,
	ALLOWED_IMPORTED_TYPE,
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
	RefElement
} from '@/headless/stores'

//======= INITIALIZATION =======//

// props
const {
	typeElementKey,
	typeElementFamily,
	typeElement,
	isImportContainer
}: {
	typeElementKey: string
	typeElementFamily: AvailableTypeFamily
	typeElement: TypeElement<AvailableTypeFamily>
	isImportContainer?: boolean
} = $props()

// local states
let isElementCardOpen = $state(false)
let isCurrentDropTarget = $state(false)
let hoverTimeout: NodeJS.Timeout | null = $state(null)

//======= DERIVED STATES =======//

const isLNodeType = $derived(typeElementFamily === TYPE_FAMILY.lNodeType)

const currentRefs = $derived(
	Object.entries(typeElement.refs) as [
		AvailableRefFamily,
		RefElementByIds<AvailableRefFamily>
	][]
)

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
	if (
		isImportContainer &&
		typeGuard.isTuplesIncludingString(
			refWrapper.source.family,
			ALLOWED_IMPORTED_TYPE
		)
	)
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

const handleOpenCollapsible = (event: DragEvent) => {
	event.preventDefault()
	if (isLNodeType || !isAllowedToDrop) return

	if (!hoverTimeout)
		hoverTimeout = setTimeout(() => {
			isElementCardOpen = true
			if (!hasRefs) isCurrentDropTarget = true
			hoverTimeout = null
		}, 500)
}

const handleCloseCollapsible = (event: DragEvent) => {
	event.preventDefault()
	if (isLNodeType || !isAllowedToDrop) return

	const dropZone = event.currentTarget as HTMLElement
	if (!dropZone?.contains(event.relatedTarget as Node | null)) {
		isCurrentDropTarget = false
		isElementCardOpen = false
	}

	if (hoverTimeout) {
		clearTimeout(hoverTimeout)
		hoverTimeout = null
	}
}

const handleDragLeave = (event: DragEvent) => {
	if (!isAllowedToDrop) return
	const dropZone = event.currentTarget as HTMLElement
	if (!dropZone?.contains(event.relatedTarget as Node | null)) {
		isCurrentDropTarget = false
		isElementCardOpen = false
	}
}

//======= EFFECTS =======//

$effect(() => {
	if (!hasRefs) isElementCardOpen = false
})
</script>

<Collapsible.Root 
	bind:open={isElementCardOpen} 
	class="space-y-1 mb-2"
	ondragover={handleOpenCollapsible}
	ondragleave={handleCloseCollapsible}
>
	<TypeCard {typeElement} {typeElementKey} {typeElementFamily} {isElementCardOpen} {isImportContainer} />


	<Collapsible.Content class="space-y-1 flex flex-col items-end relative"
		ondragover={handleDragOver}
		ondragleave={handleDragLeave}
		ondrop={(event) => {
			event.preventDefault();
			if(!isAllowedToDrop) return
			isCurrentDropTarget = false;
			dndStore.handleDrop({
				parentTypeWrapper: typeElement.element,
				parentTypeFamily: typeElementFamily
			});
		}}>
		
		{#snippet child({ props, open: collapsibleContentOpen })}
			{#if collapsibleContentOpen}
				<div {...props} transition:slide={{ duration: 100 }}  >
					<!-- DND DROP ZONE START -->
					{#if isAllowedToDrop}
						<div 
							class={`${isCurrentDropTarget ? 'flex' : 'hidden'} dropzone`}
						>
							<CirclePlus class="size-16 text-primary stroke-2" />
						</div>
					{/if}
					<!-- DND DROP ZONE END -->

					<!-- REFS CARDS START -->
					{#if typeElementFamily !== TYPE_FAMILY.lNodeType}
						{#if hasRefs}
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
											{#if !isImportContainer}
												<CardMenu type={{ family: typeElementFamily, id: typeElementKey}} ref={{ family: refFamily, id: refId}}/>
											{/if}
										</Card.Content>
									</Card.Root>
								{/each}
							{/each}
						{:else}

							<!-- DND INVISIBLE PLACEHOLDER START -->
							<div class="w-5/6 h-8 invisible"></div>
							<!-- DND INVISIBLE PLACEHOLDER END -->

						{/if}
					{/if}
					<!-- REFS CARDS END -->
				</div>
			{/if}
		{/snippet}

	</Collapsible.Content>
</Collapsible.Root>

<style>
.dropzone{
	@apply 
		absolute
		min-h-8
		top-0
		left-0
		right-0
		bottom-0
		bg-primary/20
		border-4
		border-dashed
		border-primary
		flex-col
		items-center
		justify-center;
}
</style>