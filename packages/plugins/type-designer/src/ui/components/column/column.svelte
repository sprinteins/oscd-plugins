<script lang="ts">
// CORE
import {
	GENERAL_EQUIPMENTS,
	CONDUCTING_EQUIPMENTS
} from '@oscd-plugins/core-standard/ed2'
// COMPONENTS
import { Card } from '@oscd-plugins/core-ui-svelte'
import AddElement from './add-element.svelte'
import ElementCard from '../element-card.svelte'
// TYPES
import type {
	AvailableFamilies,
	Columns,
	ElementTypes
} from '@/headless/stores/types.element-types'
import type { ColumnFooter, ItemsPerFamily, ColumnSelect } from './types.column'

//======= INITIALIZATION =======//

// props
const {
	columnKey,
	column
}: { columnKey: keyof Columns; column: Columns[keyof Columns] } = $props()

const groupedElementTypesEntries = $derived(
	Object.entries(column.groupedElementTypes) as [
		AvailableFamilies | 'lNodeType',
		ElementTypes<AvailableFamilies | 'lNodeType'>
	][]
)

//====== REACTIVE VARIABLES ======//

const generalEquipments = $derived.by<ColumnSelect[]>(() => {
	return Object.values(GENERAL_EQUIPMENTS).map((equipment) => ({
		value: equipment.type,
		label: equipment.label
	}))
})
const conductingEquipments = $derived.by<ColumnSelect[]>(() => {
	return Object.values(CONDUCTING_EQUIPMENTS).map((equipment) => ({
		value: equipment.type,
		label: equipment.label
	}))
})

const equipmentGroups = $derived<ItemsPerFamily>({
	generalEquipment: generalEquipments,
	conductingEquipment: conductingEquipments
})

const columnFooter: ColumnFooter = $derived({
	equipment: {
		itemsPerFamily: equipmentGroups,
		type: 'select'
	},
	function: {
		type: 'input'
	},
	bay: {
		type: 'input'
	}
})
</script>



<Card.Root class="{columnKey === 'lNodeType' ? 'pb-6' : ''} flex-1 flex flex-col overflow-y-hidden min-h-full " >
	<Card.Header class="pb-6">
		<Card.Title>{ column.name}</Card.Title>
	</Card.Header>

	<Card.Content class="overflow-y-auto space-y-2">
		{#each groupedElementTypesEntries as [elementTypeFamily, elementTypes]}
			{#each Object.entries(elementTypes) as [elementTypeKey, elementType]}
				<ElementCard {elementTypeKey} {elementType} {elementTypeFamily} {columnKey}/>
			{/each}
		{/each}
	</Card.Content>
		
	{#if columnKey !== 'lNodeType'}
		<Card.Footer class="mt-auto pt-6 flex w-full space-y-2 flex-col lg:space-x-2 lg:flex-row lg:space-y-0">
				<AddElement {columnKey} type={columnFooter[columnKey].type} itemsPerFamily={ columnFooter[columnKey]?.itemsPerFamily} />
		</Card.Footer>
	{/if}

</Card.Root>
