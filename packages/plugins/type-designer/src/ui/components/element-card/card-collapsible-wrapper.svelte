<script lang="ts">
// CORE
import { typeGuard } from '@oscd-plugins/core-api/plugin/v1'
// STORE
import { dndStore, typeElementsStore, importsStore } from '@/headless/stores'
// CONSTANTS
import {
	ALLOWED_TARGETS_BY_REF_FAMILY,
	TYPE_FAMILY,
	ALLOWED_IMPORTED_TYPE
} from '@/headless/constants'
// COMPONENTS
import { slide } from 'svelte/transition'
import { Card, Collapsible } from '@oscd-plugins/core-ui-svelte'
import TypeCard from './type-card.svelte'
import CardMenu from './card-menu.svelte'
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

//======= DERIVED STATES =======//

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

const currentDraggedItemLabel = $derived(
	dndStore.currentSourceTypeFamily &&
		dndStore.currentSourceTypeIdOrUuid &&
		typeElementsStore.typeElementsPerFamily[
			dndStore.currentSourceTypeFamily
		][dndStore.currentSourceTypeIdOrUuid].parameters.label
)

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

//======= EFFECTS =======//

$effect(() => {
	if (!hasRefs) isElementCardOpen = false
})
</script>
	
<Collapsible.Root bind:open={isElementCardOpen} class="space-y-2">

	<TypeCard {typeElement} {typeElementKey} {typeElementFamily} {isElementCardOpen} {isImportContainer}/>

	<!-- REF CARD START -->
		<Collapsible.Content  class="space-y-2 flex flex-col items-end">
			{#snippet child({ props, open: collapsibleContentOpen })}
				{#if collapsibleContentOpen}
					<div {...props} transition:slide={{ duration: 100 }}>
						{#if typeElementFamily !== TYPE_FAMILY.lNodeType}
							{#each currentRefs as [refFamily, refElements]}
								{#each Object.entries(refElements) as [refId, refWrapper]} 
									<Card.Root class="w-5/6" >
										<Card.Content class="h-8 p-1 flex items-center justify-between">
											<div class="flex items-center min-w-0">
												<span class="ml-3 min-w-2.5 min-h-2.5 border-teal-700 border-2 transform rotate-45"></span>
												<span class="ml-4 truncate">{ getCurrentRefFullLabel(refWrapper) }</span>
											</div>
											{#if !isImportContainer}
												<CardMenu type={{ family: typeElementFamily, id: typeElementKey}} ref={{ family: refFamily, id: refId}}/>
											{/if}
										</Card.Content>
									</Card.Root>
									{/each}
							{/each}
						{/if}
					</div>
				{/if}
			{/snippet}
		</Collapsible.Content>
	<!-- REF CARD END -->

	<!-- DND PLACEHOLDER START -->
	{#if dndStore.isDragging && isAllowedToDrop && !isImportContainer}
		<div  class="flex justify-end">
			<Card.Root
				class="border-gray-500 border-dashed w-5/6 "
				ondragover={(event) => event.preventDefault()}
				ondrop={() => dndStore.handleDrop({
					parentTypeWrapper: typeElement.element,
					parentTypeFamily: typeElementFamily
				})}
			>
				<Card.Content class="h-8 p-1 flex items-center justify-center">
					<span class="mr-1">Drop</span>
					<div class="overflow-hidden text-ellipsis">
						<span class="truncate font-bold">{currentDraggedItemLabel}</span>
					</div>
					<span class="ml-1">here.</span>
				</Card.Content>
			</Card.Root>
		</div>
	{/if}
	<!-- DND PLACEHOLDER END -->

</Collapsible.Root>