<script lang="ts">
// STORE
import { dndStore, typeElementsStore } from '@/headless/stores'
// CONSTANTS
import {
	ALLOWED_TARGETS_BY_REF_FAMILY,
	TYPE_FAMILY_MAP
} from '@/headless/constants'
// COMPONENTS
import { fade } from 'svelte/transition'
import { Card, Collapsible } from '@oscd-plugins/core-ui-svelte'
import CardRoot from './card-root.svelte'
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
</script>
	
<Collapsible.Root bind:open={isElementCardOpen} class="space-y-2">

	<CardRoot {typeElement} {typeElementKey} {typeElementFamily}/>

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