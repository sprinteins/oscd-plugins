<script lang="ts">
// STORE
import { dndStore, typeElementsStore } from '@/headless/stores'
// CONSTANTS
import {
	ALLOWED_TARGETS_BY_REF_FAMILY,
	TYPE_FAMILY_MAP
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
	RefElementByIds
} from '@/headless/stores'

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

// local states
let isElementCardOpen = $state(false)

//======= DERIVED STATES =======//

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

const currentRefs = $derived(
	Object.entries(typeElement.refs) as [
		AvailableRefFamily,
		RefElementByIds<AvailableRefFamily>
	][]
)
</script>
	
<Collapsible.Root bind:open={isElementCardOpen} class="space-y-2">

	<TypeCard {typeElement} {typeElementKey} {typeElementFamily} {isElementCardOpen}/>

	<!-- REF CARD START -->
		<Collapsible.Content  class="space-y-2 flex flex-col items-end">
			{#snippet child({ props, open: collapsibleContentOpen })}
				{#if collapsibleContentOpen}
					<div {...props} transition:slide={{ duration: 100 }}>
						{#if typeElementFamily !== TYPE_FAMILY_MAP.lNodeType}
							{#each currentRefs as [refFamily, refElements]}
								{#each Object.entries(refElements) as [refId, refWrapper]} 
									<Card.Root class="w-5/6" >
										<Card.Content class="h-14 flex items-center justify-between pr-2">
											<div class="flex items-center min-w-0">
												<span class="min-w-3 min-h-3 border-teal-700 border-2 transform rotate-45"></span>
												<span class="ml-4 truncate">{ `Ref_${typeElementsStore.typeElementsPerFamily[refWrapper.source.family][refWrapper.source.id].parameters.label}` }</span>
											</div>
											<CardMenu type={{ family: typeElementFamily, id: typeElementKey}} ref={{ family: refFamily, id: refId}}/>
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
	{#if dndStore.isDragging && isAllowedToDrop}
		<div  class="flex justify-end">
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
					<span class="mr-1">Drop</span>
					<div class="overflow-hidden text-ellipsis">
						<span class="truncate font-bold">{currentDraggedItemLabel}</span>
					</div>
					<span class="mr-2">here.</span>
				</Card.Content>
			</Card.Root>
		</div>
	{/if}
	<!-- DND PLACEHOLDER END -->

</Collapsible.Root>