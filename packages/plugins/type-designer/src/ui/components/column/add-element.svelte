<script lang="ts">
// CORE
import * as ed2 from '@oscd-plugins/core-standard/ed2'
import { Button, Input, SelectWorkaround } from '@oscd-plugins/core-ui-svelte'
// STORES
import { typeElementsStore } from '@/headless/stores'
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
		bay: `Bay_${getNameNumberOfOccurrence('bay', 'Bay', true)}`,
		generalEquipmentType: '',
		conductingEquipmentType: '',
		functionTemplate: `Func_${getNameNumberOfOccurrence(
			'functionTemplate',
			'Func',
			true
		)}`
	}

	if (newTypeInput) {
		const numberOfOccurrence = getNameNumberOfOccurrence(
			newTypeFamily,
			newTypeInput,
			false
		)
		namesByFamilies[newTypeFamily] = `${newTypeInput}_${numberOfOccurrence}`
	}

	if (
		newTypeElement &&
		(newTypeFamily === 'generalEquipmentType' ||
			newTypeFamily === 'conductingEquipmentType')
	) {
		const selectOptionValue =
			equipmentsSelectOptions.secondarySelect[newTypeFamily].find(
				(option) => option.value === newTypeElement
			)?.label || ''
		const numberOfNameOccurrence = getNameNumberOfOccurrence(
			newTypeFamily,
			selectOptionValue,
			true
		)
		namesByFamilies[newTypeFamily] =
			`${selectOptionValue}_${numberOfNameOccurrence}`
	}

	return namesByFamilies
})

const currentAttributes = $derived({
	name:
		newTypeFamily && newElementName
			? newElementName[newTypeFamily]
			: 'Type_',
	...(newTypeElement && { type: newTypeElement })
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
	generalEquipmentType: generalEquipments,
	conductingEquipmentType: conductingEquipments
})
const equipmentsSelectOptions = $derived({
	primarySelect: [
		{ value: 'generalEquipmentType', label: 'GenEq' },
		{ value: 'conductingEquipmentType', label: 'CondEq' }
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

function getNameNumberOfOccurrence(
	family: Exclude<AvailableTypeFamily, 'lNodeType'>,
	valueToTest: string,
	needsSubstring: boolean
) {
	const lastElementOfSameKind = Object.values(
		typeElementsStore.typeElementsPerFamily[family]
	)
		.filter((typeElement) => {
			if (needsSubstring) {
				const currentElementNameLength =
					typeElement.attributes?.name.length
				const currentElementNameOccurrenceAsStringLength =
					typeElement.attributes?.name.match(/\d+$/)?.[0].length
				const extraUnderscoreCharacter = 1

				const numberOfCharactersToRemove =
					currentElementNameLength -
					currentElementNameOccurrenceAsStringLength -
					extraUnderscoreCharacter

				return (
					typeElement.attributes?.name?.substring(
						0,
						numberOfCharactersToRemove
					) === valueToTest
				)
			}
			return typeElement.attributes?.name === valueToTest
		})
		.slice(-1)?.[0]

	const occurrence = Number(
		lastElementOfSameKind?.attributes?.name?.match(/\d+$/)?.[0] || 0
	)

	return occurrence + 1
}

//====== WATCHERS ======//

$effect(() => {
	if (!newTypeFamily) {
		if (columnKey === 'equipmentTypeTemplates')
			newTypeFamily = 'generalEquipmentType'
		else newTypeFamily = columnKey
	}
})
</script>


{#if columnKey === 'equipmentTypeTemplates' }
	<SelectWorkaround
		options={equipmentsSelectOptions.primarySelect}
		bind:value={newTypeFamily}
		handleChange={() => {
			newTypeElement = ''
		}}
	/>
	<SelectWorkaround
		options={(newTypeFamily === 'generalEquipmentType' || newTypeFamily === 'conductingEquipmentType') && equipmentsSelectOptions.secondarySelect[newTypeFamily] || []}
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
	disabled={columnKey === 'equipmentTypeTemplates' && !(!!newTypeElement)}
>
	Add
</Button.Root>
