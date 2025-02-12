<script lang="ts">
// COMPONENTS
import { Card } from '@oscd-plugins/core-ui-svelte'
import AddElement from './add-element.svelte'
import CardCollapsibleWrapper from '../element-card/card-collapsible-wrapper.svelte'
// TYPES
import type {
	AvailableTypeFamily,
	Columns,
	Column,
	TypeElements
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
		TypeElements<AvailableTypeFamily>
	][]
)
</script>

<Card.Root class="{columnKey === 'lNodeType' ? 'pb-6' : ''} flex-1 flex flex-col overflow-y-hidden min-h-full " >
	<Card.Header class="pb-6">
		<Card.Title>{ column.name}</Card.Title>
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
