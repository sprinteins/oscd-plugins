<script lang="ts">
// CORE
import * as ed2 from '@oscd-plugins/core-standard/ed2'
import { Button, Input, SelectWorkaround } from '@oscd-plugins/core-ui-svelte'
// STORES
import { typeElementsStore } from '@/headless/stores'
// CONSTANTS
import { COLUMN_KEY_TO_TYPE_FAMILY } from '@/headless/constants'
// TYPES
import type { AvailableTypeFamily, Columns } from '@/headless/stores'

//====== INITIALIZATION ======//

// props
const {
	columnKey
}: {
	columnKey: Exclude<keyof Columns, 'lNodeType'>
} = $props()

// binding
let newTypeInput = $state('')
let newTypeElement = $state('')
let newTypeFamily = $state<Exclude<AvailableTypeFamily, 'lNodeType'>>()

//====== REACTIVE VARIABLES ======//

const newElementName = $derived.by(() => {
	if (!newTypeFamily) return

	const namesByFamilies = {
		bay: `Bay_${typeElementsStore.getTypeNextOccurrence({ family: 'bay', valueToTest: 'Bay', removeOccurrencePartToTestedValue: true })}`,
		generalEquipment: '',
		conductingEquipment: '',
		function: `Func_${typeElementsStore.getTypeNextOccurrence({
			family: 'function',
			valueToTest: 'Func',
			removeOccurrencePartToTestedValue: true
		})}`
	}

	if (newTypeInput) {
		const numberOfOccurrence = typeElementsStore.getTypeNextOccurrence({
			family: newTypeFamily,
			valueToTest: newTypeInput,
			removeOccurrencePartToTestedValue: false
		})
		namesByFamilies[newTypeFamily] = `${newTypeInput}_${numberOfOccurrence}`
	}

	if (
		newTypeElement &&
		(newTypeFamily === 'generalEquipment' ||
			newTypeFamily === 'conductingEquipment')
	) {
		const selectOptionValue =
			equipmentsSelectOptions.secondarySelect[newTypeFamily].find(
				(option) => option.value === newTypeElement
			)?.label || ''
		const numberOfNameOccurrence = typeElementsStore.getTypeNextOccurrence({
			family: newTypeFamily,
			valueToTest: selectOptionValue,
			removeOccurrencePartToTestedValue: true
		})
		namesByFamilies[newTypeFamily] =
			`${selectOptionValue}_${numberOfNameOccurrence}`
	}

	return namesByFamilies
})

const currentAttributes = $derived({
	name:
		newTypeFamily && newElementName
			? newElementName[newTypeFamily]
			: 'Type_'
})

// equipments select options
const generalEquipments = $derived(
	Object.values(ed2.rev1.stable.GENERAL_EQUIPMENTS).map((equipment) => ({
		value: equipment.type,
		label: equipment.label
	}))
)
const conductingEquipments = $derived(
	Object.values(ed2.rev1.stable.CONDUCTING_EQUIPMENTS).map((equipment) => ({
		value: equipment.type,
		label: equipment.label
	}))
)
const equipmentGroups = $derived({
	generalEquipment: generalEquipments,
	conductingEquipment: conductingEquipments
})
const equipmentsSelectOptions = $derived({
	primarySelect: [
		{ value: 'generalEquipment', label: 'GenEq' },
		{ value: 'conductingEquipment', label: 'CondEq' }
	],
	secondarySelect: equipmentGroups
})

//====== FUNCTIONS ======//

function handleAddNewElement() {
	if (!newTypeFamily) return

	typeElementsStore.createNewType({
		family: newTypeFamily,
		attributes: currentAttributes
	})

	newTypeInput = ''
	newTypeElement = ''
}

//====== WATCHERS ======//

$effect(() => {
	if (!newTypeFamily) {
		newTypeFamily = Array.isArray(COLUMN_KEY_TO_TYPE_FAMILY[columnKey])
			? COLUMN_KEY_TO_TYPE_FAMILY[columnKey][0]
			: COLUMN_KEY_TO_TYPE_FAMILY[columnKey]
	}
})
</script>


{#if columnKey === 'equipmentType' }
	<SelectWorkaround
		options={equipmentsSelectOptions.primarySelect}
		bind:value={newTypeFamily}
		handleChange={() => {
			newTypeElement = ''
		}}
	/>
	<SelectWorkaround
		options={(newTypeFamily === 'generalEquipment' || newTypeFamily === 'conductingEquipment') && equipmentsSelectOptions.secondarySelect[newTypeFamily] || []}
		bind:value={newTypeElement}
		placeholder="Select Eq"
	/>

{:else}
	<Input.Root
		bind:value={newTypeInput}
		placeholder={newTypeFamily && newElementName?.[newTypeFamily]}
	/>
{/if}

<Button.Root
	class="w-full lg:w-auto"
	variant="ghost"
	onclick={handleAddNewElement}
	disabled={columnKey === 'equipmentType' && !(!!newTypeElement)}
>
	Add
</Button.Root>
