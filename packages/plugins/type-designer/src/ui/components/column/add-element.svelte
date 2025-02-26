<script lang="ts">
// CORE
import { typeGuard } from '@oscd-plugins/core-api/plugin/v1'
import * as ed2 from '@oscd-plugins/core-standard/ed2'
import { Button, Input, SelectWorkaround } from '@oscd-plugins/core-ui-svelte'
// STORES
import { typeElementsStore } from '@/headless/stores'
// CONSTANTS
import { COLUMN_KEY_TO_TYPE_FAMILY, TYPE_FAMILY } from '@/headless/constants'
// TYPES
import type {
	AvailableTypeFamily,
	Columns,
	TypeToCreateChildren
} from '@/headless/stores'

//====== INITIALIZATION ======//

// props
const {
	columnKey
}: {
	columnKey: Exclude<keyof Columns, 'lNodeType'>
} = $props()

// binding
let newTypeInputValue = $state('')
let newEquipmentTypeSelectValue = $state<keyof typeof rawEquipments>()
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

	if (newTypeInputValue) {
		const numberOfOccurrence = typeElementsStore.getTypeNextOccurrence({
			family: newTypeFamily,
			valueToTest: newTypeInputValue,
			removeOccurrencePartToTestedValue: false
		})
		namesByFamilies[newTypeFamily] =
			`${newTypeInputValue}_${numberOfOccurrence}`
	}

	if (
		newEquipmentTypeSelectValue &&
		(newTypeFamily === TYPE_FAMILY.generalEquipment ||
			newTypeFamily === TYPE_FAMILY.conductingEquipment)
	) {
		const selectOptionValue =
			rawEquipments[newEquipmentTypeSelectValue].label

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

const rawEquipments = {
	...ed2.rev1.stable.GENERAL_EQUIPMENTS,
	...ed2.rev1.stable.CONDUCTING_EQUIPMENTS
}

const generalEquipments = $derived.by(() => {
	const generalEquipmentEntries = Object.entries(
		ed2.rev1.stable.GENERAL_EQUIPMENTS
	) as [
		keyof typeof ed2.rev1.stable.GENERAL_EQUIPMENTS,
		(typeof ed2.rev1.stable.GENERAL_EQUIPMENTS)[keyof typeof ed2.rev1.stable.GENERAL_EQUIPMENTS]
	][]

	return generalEquipmentEntries.map(([key, equipment]) => ({
		value: key,
		label: equipment.label
	}))
})
const conductingEquipments = $derived.by(() => {
	const conductingEquipmentEntries = Object.entries(
		ed2.rev1.stable.CONDUCTING_EQUIPMENTS
	) as [
		keyof typeof ed2.rev1.stable.CONDUCTING_EQUIPMENTS,
		(typeof ed2.rev1.stable.CONDUCTING_EQUIPMENTS)[keyof typeof ed2.rev1.stable.CONDUCTING_EQUIPMENTS]
	][]

	return conductingEquipmentEntries.map(([key, equipment]) => ({
		value: key,
		label: equipment.label
	}))
})

const equipmentGroups = $derived({
	generalEquipment: generalEquipments,
	conductingEquipment: conductingEquipments
})
const equipmentsSelectOptions = $derived({
	primarySelect: [
		{ value: TYPE_FAMILY.generalEquipment, label: 'GenEq' },
		{ value: TYPE_FAMILY.conductingEquipment, label: 'CondEq' }
	],
	secondarySelect:
		((newTypeFamily === 'generalEquipment' ||
			newTypeFamily === 'conductingEquipment') &&
			equipmentGroups[newTypeFamily]) ||
		[]
})

const conductingEquipmentChildren = $derived.by(() => {
	let numberOfTerminals: number | undefined
	const defaultNumberOfTerminals = 2
	const terminalPayload = {
		family: 'terminal' as const,
		attributes: {
			name: 'None',
			connectivityNode: 'None',
			cNodeName: 'None'
		}
	}
	if (
		newTypeFamily === TYPE_FAMILY.conductingEquipment &&
		newEquipmentTypeSelectValue &&
		typeGuard.isPropertyOfObject(
			newEquipmentTypeSelectValue,
			ed2.rev1.stable.CONDUCTING_EQUIPMENTS
		)
	)
		numberOfTerminals =
			rawEquipments[newEquipmentTypeSelectValue].numberOfTerminals

	return Array.from(
		{ length: numberOfTerminals || defaultNumberOfTerminals },
		() => terminalPayload
	)
})

//====== FUNCTIONS ======//

function handleAddNewElement() {
	if (!newTypeFamily) return
	let children: undefined | TypeToCreateChildren

	if (newTypeFamily === TYPE_FAMILY.conductingEquipment) {
		children = conductingEquipmentChildren
	}

	typeElementsStore.createNewType({
		family: newTypeFamily,
		attributes: currentAttributes,
		children
	})

	newTypeInputValue = ''
	newEquipmentTypeSelectValue = undefined
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
			newEquipmentTypeSelectValue = undefined
		}}
	/>
	<SelectWorkaround
		options={equipmentsSelectOptions.secondarySelect}
		bind:value={newEquipmentTypeSelectValue}
		placeholder="Select Eq"
	/>

{:else}
	<Input.Root
		bind:value={newTypeInputValue}
		placeholder={newTypeFamily && newElementName?.[newTypeFamily]}
	/>
{/if}

<Button.Root
	class="w-full lg:w-auto"
	variant="ghost"
	onclick={handleAddNewElement}
	disabled={columnKey === 'equipmentType' && !(!!newEquipmentTypeSelectValue)}
>
	Add
</Button.Root>
