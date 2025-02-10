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
		bay: `Bay_${Object.keys(typeElementsStore.typeElementsPerFamily[newTypeFamily]).length + 1}`,
		generalEquipmentType: `_${Object.keys(typeElementsStore.typeElementsPerFamily[newTypeFamily]).length + 1}`,
		conductingEquipmentType: `_${Object.keys(typeElementsStore.typeElementsPerFamily[newTypeFamily]).length + 1}`,
		functionTemplate: `Func_${Object.keys(typeElementsStore.typeElementsPerFamily[newTypeFamily]).length + 1}`
	}

	if (newTypeInput) {
		const numberOfOccurrence = getNameNumberOfOccurrence(
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

	typeElementsStore.createNewElementType({
		family: newTypeFamily,
		attributes: currentAttributes
	})

	newTypeInput = ''
	newTypeElement = ''
}

function getNameNumberOfOccurrence(
	valueToTest: string,
	needsSubstring: boolean
) {
	if (!newTypeFamily) return
	return (
		Object.values(
			typeElementsStore.typeElementsPerFamily[newTypeFamily]
		).filter((typeElement) => {
			if (needsSubstring)
				return (
					typeElement.attributes?.name?.substring(
						0,
						typeElement.attributes?.name.length - 2
					) === valueToTest
				)

			return typeElement.attributes?.name === valueToTest
		}).length + 1
	)
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
