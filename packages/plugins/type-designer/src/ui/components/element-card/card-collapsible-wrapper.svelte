<script lang="ts">
import { onMount } from 'svelte';
// CORE
import { typeGuard } from '@oscd-plugins/core-api/plugin/v1'
// STORE
import { dndStore, typeElementsStore, importsStore } from '@/headless/stores'
// CONSTANTS
import {
	ALLOWED_TARGETS_BY_REF_FAMILY,
	TYPE_FAMILY,
	ALLOWED_IMPORTED_TYPE,
	REF_FAMILY
} from '@/headless/constants'
// COMPONENTS
import { slide } from 'svelte/transition'
import { Card, Collapsible, Badge } from '@oscd-plugins/core-ui-svelte'
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

//======= EFFECTS =======//

$effect(() => {
	if (!hasRefs) isElementCardOpen = false
})

let scrollableContainer: HTMLElement;
let lastScrollPosition = 0;

let isCurrentDropTarget = $state(false);
let dragLeaveTimeout: number | undefined;

const handleDragOver = (event: DragEvent) => {
	event.preventDefault();
	if (dndStore.handleDragOver({ targetId: typeElementKey, isAllowedToDrop })) {
		if (dragLeaveTimeout) {
			clearTimeout(dragLeaveTimeout);
			dragLeaveTimeout = undefined;
		}
		
		const target = event.target as HTMLElement;
		scrollableContainer = target.closest('.overflow-y-auto') as HTMLElement;
		if (scrollableContainer) {
			lastScrollPosition = scrollableContainer.scrollTop;
		}
		
		isCurrentDropTarget = true;
		isElementCardOpen = true;
	}
};

const handleDragLeave = (event: DragEvent) => {
	const target = event.target as HTMLElement;
	const relatedTarget = event.relatedTarget as HTMLElement;
	
	if (relatedTarget && target.contains(relatedTarget)) {
		return;
	}
	
	// prevents flickering of the collapsible element, otherwise it jumps like crazy when dragging over the refs
	dragLeaveTimeout = window.setTimeout(() => {
		isElementCardOpen = false;
	}, 50);
};

onMount(() => {
	const hideHandler = () => {
		isCurrentDropTarget = false;
	};
	window.addEventListener('hideAllDropZones', hideHandler);
	return () => {
		window.removeEventListener('hideAllDropZones', hideHandler);
		if (dragLeaveTimeout) {
			clearTimeout(dragLeaveTimeout);
		}
	};
});
</script>
	
<Collapsible.Root 
	bind:open={isElementCardOpen} 
	class="space-y-2"
	ondragover={handleDragOver}
	ondragleave={handleDragLeave}
	ondrop={() => {
		if (dndStore.currentDropTargetId === typeElementKey) {
			isCurrentDropTarget = false;
			dndStore.handleDrop({
				parentTypeWrapper: typeElement.element,
				parentTypeFamily: typeElementFamily
			});
			if (scrollableContainer) {
				setTimeout(() => {
					scrollableContainer.scrollTop = lastScrollPosition;
				}, 0);
			}
		}
	}}
>
	<TypeCard {typeElement} {typeElementKey} {typeElementFamily} {isElementCardOpen} {isImportContainer}/>

		<!-- REF CARD START -->
		<Collapsible.Content class="space-y-2 flex flex-col items-end">
			{#snippet child({ props, open: collapsibleContentOpen })}
				{#if collapsibleContentOpen}
					<div {...props} transition:slide={{ duration: 100 }}>
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
	{#if dndStore.isDragging && isAllowedToDrop && isCurrentDropTarget && !isImportContainer}
		<div  class="flex justify-end">
			<Card.Root
				class="border-gray-500 border-dashed w-5/6 "
				ondragover={(event) => event.preventDefault()}
				ondrop={(event) => {
					event.preventDefault();
					isCurrentDropTarget = false;
					dndStore.handleDrop({
						parentTypeWrapper: typeElement.element,
						parentTypeFamily: typeElementFamily
					});
					if (scrollableContainer) {
						setTimeout(() => {
							scrollableContainer.scrollTop = lastScrollPosition;
						}, 0);
					}
				}}
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

