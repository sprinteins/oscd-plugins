<script lang="ts">
import { onMount } from 'svelte'
// CORE
import { Button, Input, SelectWorkaround } from '@oscd-plugins/core-ui-svelte'
// STORES
import { typeElementsStore } from '@/headless/stores'
// CONSTANTS
import {
	COLUMN_KEY_TO_TYPE_FAMILY,
	TYPE_FAMILY,
	GENERAL_EQUIPMENTS,
	CONDUCTING_EQUIPMENTS
} from '@/headless/constants'
// TYPES
import type { Utils } from '@oscd-plugins/core-api/plugin/v1'
import type { AvailableTypeFamily, Columns } from '@/headless/stores'

//====== INITIALIZATION ======//

// props
const {
	columnKey
}: {
	columnKey: Exclude<keyof Columns, 'lNodeType'>
} = $props()

let currentColumnTypeFamily =
	$state<Exclude<AvailableTypeFamily, 'lNodeType'>>()

const generalEquipmentOptions = $derived.by(() => {
	const generalEquipmentEntries = Object.entries(
		GENERAL_EQUIPMENTS
	) as Utils.Entries<typeof GENERAL_EQUIPMENTS>

	return generalEquipmentEntries.map(([key, equipment]) => ({
		value: key,
		label: equipment.label
	}))
})

const conductingEquipmentOptions = $derived.by(() => {
	const conductingEquipmentEntries = Object.entries(
		CONDUCTING_EQUIPMENTS
	) as Utils.Entries<typeof CONDUCTING_EQUIPMENTS>

	return conductingEquipmentEntries.map(([key, equipment]) => ({
		value: key,
		label: equipment.label
	}))
})

const equipmentFamilyOptions = [
	{ value: TYPE_FAMILY.generalEquipment, label: 'GenEq' },
	{ value: TYPE_FAMILY.conductingEquipment, label: 'CondEq' }
]

const equipmentTypeOptions = $derived.by(() => {
	if (currentColumnTypeFamily === 'generalEquipment')
		return generalEquipmentOptions
	if (currentColumnTypeFamily === 'conductingEquipment')
		return conductingEquipmentOptions
	return undefined
})

//====== FUNCTIONS ======//

async function handleAddNewElement() {
	if (!currentColumnTypeFamily) throw new Error('No type family selected')

	await typeElementsStore.createNewType({
		family: currentColumnTypeFamily,
		withChildren:
			currentColumnTypeFamily === TYPE_FAMILY.conductingEquipment
	})

	typeElementsStore.newEquipmentType = undefined
}

function getCurrentTypeFamily() {
	return Array.isArray(COLUMN_KEY_TO_TYPE_FAMILY[columnKey])
		? COLUMN_KEY_TO_TYPE_FAMILY[columnKey][0]
		: COLUMN_KEY_TO_TYPE_FAMILY[columnKey]
}
//====== WATCHERS ======//

onMount(() => {
	currentColumnTypeFamily = getCurrentTypeFamily()
})
</script>


{#if columnKey === 'equipmentType' }
	<SelectWorkaround
		options={equipmentFamilyOptions}
		bind:value={currentColumnTypeFamily}
		handleChange={() => {
			typeElementsStore.newEquipmentType = undefined
		}}
	/>
	<SelectWorkaround
		options={equipmentTypeOptions}
		bind:value={typeElementsStore.newEquipmentType}
		placeholder="Select Eq"
	/>

{:else if columnKey === 'bayType' || columnKey === 'functionType'}
	<Input.Root
		bind:value={typeElementsStore.newTypeNameInputValueByColumnKey[columnKey]}
		placeholder={currentColumnTypeFamily && typeElementsStore.newComputedTypeName?.[currentColumnTypeFamily]}
	/>
{/if}

<Button.Root
	class="w-full lg:w-auto"
	variant="ghost"
	onclick={handleAddNewElement}
	disabled={columnKey === 'equipmentType' && !(!!typeElementsStore.newEquipmentType)}
>
	Add
</Button.Root>
