<script lang="ts">
// SVELTE
import { slide } from 'svelte/transition'
// COMPONENTS
import { Card, Input } from '@oscd-plugins/core-ui-svelte'
import AddElement from './add-element.svelte'
import CardCollapsibleWrapper from '../element-card/card-collapsible-wrapper.svelte'
import ImportSelect from '@/ui/components/import/import-select.svelte'
import ImportContainer from '@/ui/components/import/import-container.svelte'
// STORES
import { typeElementsStore, importsStore, dndStore } from '@/headless/stores'
// TYPES
import type {
	AvailableTypeFamily,
	SortedImportedTypeElements,
	AvailableImportedTypeFamily,
	Columns,
	Column,
	TypeElementByIds
} from '@/headless/stores'
import { ALLOWED_TARGETS_BY_REF_FAMILY, COLUMN_KEY_TO_TYPE_FAMILY, TYPE_FAMILY } from '@/headless/constants';

//======= INITIALIZATION =======//

// props
const {
	columnKey,
	column
}: {
	columnKey: keyof Columns
	column: Column<AvailableTypeFamily>
} = $props()

//====== DERIVED STATES ======//

const groupedTypeElementsEntries = $derived(
	Object.entries(column.groupedTypeElements) as [
		AvailableTypeFamily,
		TypeElementByIds<AvailableTypeFamily>
	][]
)
const hasTypeElements = $derived.by(() => {
	return (
		groupedTypeElementsEntries?.length &&
		groupedTypeElementsEntries.some(
			([, typeElements]) =>
				typeElements && Object.keys(typeElements)?.length
		)
	)
})

const groupedImportedTypeElementsEntries = $derived.by(() => {
	if (column.importedTypeElements)
		return Object.entries(column.importedTypeElements) as [
			AvailableImportedTypeFamily,
			SortedImportedTypeElements<AvailableImportedTypeFamily>
		][]
})
const hasImportedTypeElements = $derived.by(() => {
	return groupedImportedTypeElementsEntries?.some(
		([, importedTypeElements]) =>
			importedTypeElements.all &&
			Object.keys(importedTypeElements.all)?.length
	)
})

const shouldResizeContainerToHalf = $derived(
	hasImportedTypeElements &&
		(columnKey === 'functionType' || columnKey === 'lNodeType') &&
		importsStore.isContainerOpen[columnKey]
)

const capitalizedColumnKey = $derived(
	columnKey.charAt(0).toUpperCase() + columnKey.slice(1)
)

const isColumnDisabled = $derived.by(() => {
    if (!dndStore.isDragging) return false;
    
    // Ref
    if (dndStore.currentSourceRefFamily) {
        return !ALLOWED_TARGETS_BY_REF_FAMILY[dndStore.currentSourceRefFamily]
            .some(allowedFamily => {
                if (Array.isArray(COLUMN_KEY_TO_TYPE_FAMILY[columnKey])) {
                    return COLUMN_KEY_TO_TYPE_FAMILY[columnKey].includes(allowedFamily);
                }
                return COLUMN_KEY_TO_TYPE_FAMILY[columnKey] === allowedFamily;
            });
    }
    
    // Funktion
    if (dndStore.currentSourceTypeFamily === TYPE_FAMILY.function) {
        const allowedFamilies = [TYPE_FAMILY.bay, TYPE_FAMILY.generalEquipment, TYPE_FAMILY.conductingEquipment];
        if (Array.isArray(COLUMN_KEY_TO_TYPE_FAMILY[columnKey])) {
            return !COLUMN_KEY_TO_TYPE_FAMILY[columnKey].some(family => allowedFamilies.includes(family));
        }
        return !allowedFamilies.includes(COLUMN_KEY_TO_TYPE_FAMILY[columnKey]);
    }
    
    return true;
});
</script>

<Card.Root class="{columnKey === 'lNodeType' ? 'pb-4' : ''} flex-1 flex flex-col min-h-full {isColumnDisabled ? 'opacity-40' : ''}" >
	<Card.Header class="pb-4">
		<div class="flex justify-between">
			<Card.Title>{ column.name}</Card.Title>
			{#if columnKey === 'functionType' || columnKey === 'lNodeType'}
				<ImportSelect {columnKey} />
			{/if}
		</div>
		<Input.Root
			bind:value={typeElementsStore.filtersByColumns[columnKey]}
			class="!mt-4"
			placeholder={`Search by ${capitalizedColumnKey}`}>
		</Input.Root>
	</Card.Header>

	<Card.Content class={`${hasTypeElements ? "pb-4" : "pb-0"} px-4 pt-4 overflow-y-hidden h-full`}>

		{#if groupedImportedTypeElementsEntries?.length && (columnKey === 'functionType' || columnKey === 'lNodeType') && importsStore.isContainerOpen[columnKey]}
			<div
				transition:slide
				class={`${hasTypeElements ? "h-1/2 pb-2" : "h-full pb-0"} px-2 pt-2 -mx-2 -mt-2 mb-2 overflow-hidden`}
			>
				<ImportContainer {columnKey} {groupedImportedTypeElementsEntries}/>
			</div>
		{/if}	
		
		{#if hasTypeElements}
			<div class={`${shouldResizeContainerToHalf ? "h-1/2" : "h-full"} overflow-y-auto p-2`}>
				{#each groupedTypeElementsEntries as [typeElementFamily, typeElements]}
					{#each Object.entries(typeElements) as [typeElementKey, typeElement]}
						<CardCollapsibleWrapper {typeElementKey} {typeElement} {typeElementFamily}/>
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
