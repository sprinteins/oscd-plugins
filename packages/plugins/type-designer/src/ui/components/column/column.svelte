<script lang="ts">
// COMPONENTS
import { Card } from '@oscd-plugins/core-ui-svelte'
import AddElement from './add-element.svelte'
import CardCollapsibleWrapper from '../element-card/card-collapsible-wrapper.svelte'
import { Input } from '@oscd-plugins/core-ui-svelte'
// STORES
import { typeElementsStore } from '@/headless/stores'
// TYPES
import type {
	AvailableTypeFamily,
	Columns,
	Column,
	TypeElementByIds
} from '@/headless/stores'

//======= INITIALIZATION =======//

// props
const {
	columnKey,
	column
}: { columnKey: keyof Columns; column: Column<AvailableTypeFamily> } = $props()

const groupedTypeElementsEntries = $derived(
	Object.entries(column.groupedTypeElements) as [
		AvailableTypeFamily,
		TypeElementByIds<AvailableTypeFamily>
	][]
)

const capitalizedColumnKey = $derived(
	columnKey.charAt(0).toUpperCase() + columnKey.slice(1)
)
</script>

<Card.Root class="{columnKey === 'lNodeType' ? 'pb-6' : ''} flex-1 flex flex-col overflow-y-hidden min-h-full " >
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
