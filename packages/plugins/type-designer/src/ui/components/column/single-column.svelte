<script lang="ts">
// SVELTE
import { slide } from 'svelte/transition'
// COMPONENTS
import { Card, Input } from '@oscd-plugins/core-ui-svelte'
import AddElement from './add-element.svelte'
import CardCollapsibleWrapper from '../element-card/card-collapsible-wrapper.svelte'
import ImportContainer from '@/ui/components/import/import-container.svelte'
// STORES
import { typeElementsStore, importsStore, dndStore } from '@/headless/stores'
// TYPES
import type {
	AvailableTypeFamily,
	SortedImportedTypeElements,
	Columns,
	Column,
	TypeElementByIds
} from '@/headless/stores'
import {
	ALLOWED_TARGETS_BY_REF_FAMILY,
	COLUMN_KEY_TO_TYPE_FAMILY,
	ALLOWED_TARGETS_BY_TYPE_FAMILY,
	TYPE_FAMILY
} from '@/headless/constants'

//======= INITIALIZATION =======//

// props
const {
	columnKey,
	column
}: {
	columnKey: keyof Columns
	column: Column<AvailableTypeFamily>
} = $props()

//======= STATES =======//

let columnContentElement = $state<HTMLElement | null>(null)

//====== DERIVED STATES ======//

//====== OBJECT ENTRIES

const groupedTypeElementsEntries = $derived(
	Object.entries(column.groupedTypeElements) as [
		AvailableTypeFamily,
		TypeElementByIds<AvailableTypeFamily>
	][]
)

const groupedLoadedTypeElementsEntries = $derived.by(() => {
	return Object.entries(column.importedTypeElements) as [
		AvailableTypeFamily,
		SortedImportedTypeElements<AvailableTypeFamily>
	][]
})

//====== TESTERS

const hasTypeElements = $derived.by(() => {
	return groupedTypeElementsEntries.some(
		([, typeElements]) => typeElements && Object.keys(typeElements)?.length
	)
})

const isImportViewActive = $derived(!!importsStore.currentFilename)

const capitalizedColumnKey = $derived(
	columnKey.charAt(0).toUpperCase() + columnKey.slice(1)
)

const isColumnDisabled = $derived.by(() => {
	if (!dndStore.isDragging) return false

	const currentColumnTypeFamily = Array.isArray(
		COLUMN_KEY_TO_TYPE_FAMILY[columnKey]
	)
		? COLUMN_KEY_TO_TYPE_FAMILY[columnKey]
		: [COLUMN_KEY_TO_TYPE_FAMILY[columnKey]]

	// Ref
	if (dndStore.currentSourceRefFamily) {
		const allowedTypeFamilies =
			ALLOWED_TARGETS_BY_REF_FAMILY[dndStore.currentSourceRefFamily]

		const isAllowed = allowedTypeFamilies.some((allowedTypeFamily) => {
			return currentColumnTypeFamily.some(
				(family) => family === allowedTypeFamily
			)
		})

		return !isAllowed
	}

	// Function template - not yet instantiated
	if (dndStore.currentSourceTypeFamily === TYPE_FAMILY.function) {
		const allowedTypeFamilies =
			ALLOWED_TARGETS_BY_TYPE_FAMILY[TYPE_FAMILY.function]
		const isAllowed = currentColumnTypeFamily.some((typeFamily) =>
			allowedTypeFamilies.includes(typeFamily)
		)

		return !isAllowed
	}
})
</script>

<Card.Root class="{columnKey === 'lNodeType' ? 'pb-4' : ''} flex-1 flex flex-col min-h-full {isColumnDisabled ? 'opacity-40' : ''}" >
	<Card.Header class="pb-4">
		<div class="flex justify-between">
			<Card.Title>{ column.name}</Card.Title>
		</div>
		<Input.Root
			bind:value={typeElementsStore.filtersByColumns[columnKey]}
			class="!mt-4"
			placeholder={`Search by ${capitalizedColumnKey}`}>
		</Input.Root>
	</Card.Header>

	<Card.Content class="pb-0 px-2 pt-4 overflow-y-hidden h-full flex flex-col">

		{#if isImportViewActive}
			<div
				transition:slide
				class={`${hasTypeElements ? 'h-3/4' : 'h-full'} px-4 pt-2 -mx-2 -mt-2 overflow-hidden`}
			>
				<ImportContainer {columnKey} {groupedLoadedTypeElementsEntries}/>
			</div>
		{/if}	
		
		{#if hasTypeElements}
			<div class={`${isImportViewActive ? "h-1/4" : "flex-1"} overflow-y-auto p-2`} bind:this={columnContentElement}>
				{#each groupedTypeElementsEntries as [typeElementFamily, typeElements]}
					{@const typeElementsEntries = Object.entries(typeElements)}
					{#each typeElementsEntries as [typeElementKey, typeElement], index (typeElementKey)}
						<CardCollapsibleWrapper {typeElementKey} {typeElement} {typeElementFamily} isLast={typeElementsEntries.length === index +1} {columnContentElement}/>
					{/each}
				{/each}
			</div>
		{/if}
	</Card.Content>

	{#if columnKey !== 'lNodeType'}
		<Card.Footer class={`${hasTypeElements ? "pt-4" : "pt-0"} mt-auto flex w-full space-y-2 flex-col xl:space-x-2 xl:flex-row xl:space-y-0`}>
				<AddElement {columnKey} />
		</Card.Footer>
	{/if}

</Card.Root>
