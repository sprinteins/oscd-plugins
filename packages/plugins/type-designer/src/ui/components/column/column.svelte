<script lang="ts">
// COMPONENTS
import { Card } from '@oscd-plugins/core-ui-svelte'
import AddElement from './add-element.svelte'
import CardCollapsibleWrapper from '../element-card/card-collapsible-wrapper.svelte'
import { Input } from '@oscd-plugins/core-ui-svelte'
// STORES
import { typeElementsStore, dndStore } from '@/headless/stores'
// TYPES
import type {
	AvailableTypeFamily,
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

const groupedTypeElementsEntries = $derived(
	Object.entries(column.groupedTypeElements) as [
		AvailableTypeFamily,
		TypeElementByIds<AvailableTypeFamily>
	][]
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

<Card.Root class="{columnKey === 'lNodeType' ? 'pb-6' : ''} flex-1 flex flex-col overflow-y-hidden min-h-full {isColumnDisabled ? 'opacity-40' : ''}" >
	<Card.Header class="pb-6">
		<Card.Title>{ column.name}</Card.Title>
		<Input.Root
			bind:value={typeElementsStore.filtersByColumns[columnKey]}
			class="!mt-4"
			placeholder={`Search by ${capitalizedColumnKey}`}>
		</Input.Root>
	</Card.Header>

	<Card.Content class="overflow-y-auto space-y-2 h-full">
		{#each groupedTypeElementsEntries as [typeElementFamily, typeElements]}
			{#each Object.entries(typeElements) as [typeElementKey, typeElement]}
				<CardCollapsibleWrapper {typeElementKey} {typeElement} {typeElementFamily}/>
			{/each}
		{/each}
	</Card.Content>
		
	{#if columnKey !== 'lNodeType'}
		<Card.Footer class="mt-auto pt-6 flex w-full space-y-2 flex-col lg:space-x-2 lg:flex-row lg:space-y-0">
				<AddElement {columnKey} />
		</Card.Footer>
	{/if}

</Card.Root>
