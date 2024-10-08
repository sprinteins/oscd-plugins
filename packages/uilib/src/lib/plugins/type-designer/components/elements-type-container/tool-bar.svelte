<div class="container" bind:this={currentHtmlContext} >
	{#if showFields}
		<div class="input-fields">
			{#each fieldsConfig[currentFieldsToShow] as field}
				<label for={field.name}>{field.label}:</label>
				<input
					type={field.type}
					id={field.name}
					name={field.name}
					on:input={handleInputChange}
				/>
			{/each}
			<Button on:click={addElement}>
				Create element
			</Button>
		</div>
	{/if}
	{#each buttons as { name, onClick }}
		<Button on:click={onClick}>{name}</Button>
	{/each}
</div>

<style>
	.container {
		position: fixed;
		bottom: 0;
		right: 0;
		display: flex;
		flex-direction: column;
		align-items: flex-end;
		gap: 8px;
		padding: 16px;
	}
</style>

<script lang="ts">
// COMPONENTS
import Button from '@smui/button'
// STORES
import { xmlDocumentStore } from '../../stores'
// CONSTANTS
import { ELEMENT_NAMES } from '@oscd-plugins/core'
// TYPES
import type { AllowedElements, DataTypeTemplates } from '@oscd-plugins/core'

//==== INITIALIZATION ====//

//constants
const fieldsConfig: Record<
	AllowedElements,
	{ name: string; label: string; type: 'text' }[]
> = {
	substation: [
		{ name: 'id', label: 'ID', type: 'text' },
		{ name: 'name', label: 'Name', type: 'text' },
		{ name: 'desc', label: 'Description', type: 'text' }
	],
	voltageLevel: [
		{ name: 'id', label: 'ID', type: 'text' },
		{ name: 'name', label: 'Name', type: 'text' },
		{ name: 'desc', label: 'Description', type: 'text' },
		{ name: 'nomFreq', label: 'Nominal Frequency', type: 'text' },
		{ name: 'numPhases', label: 'Number of Phases', type: 'text' }
	],
	bay: [
		{ name: 'id', label: 'ID', type: 'text' },
		{ name: 'name', label: 'Name', type: 'text' },
		{ name: 'desc', label: 'Description', type: 'text' }
	],
	ied: [
		{ name: 'id', label: 'ID', type: 'text' },
		{ name: 'name', label: 'Name', type: 'text' },
		{ name: 'desc', label: 'Description', type: 'text' },
		{ name: 'manufacturer', label: 'Manufacturer', type: 'text' },
		{ name: 'type', label: 'Type', type: 'text' },
		{ name: 'originalSclRevision', label: 'SclRevision', type: 'text' },
		{ name: 'originalSclVersion', label: 'SclVersion', type: 'text' },
		{ name: 'owner', label: 'Owner', type: 'text' }
	],
	lDevice: [
		{ name: 'id', label: 'ID', type: 'text' },
		{ name: 'desc', label: 'Description', type: 'text' },
		{ name: 'inst', label: 'Instance', type: 'text' }
	]
}

const buttons = [
	{
		name: ELEMENT_NAMES.substation,
		onClick: () => toggleFields('substation')
	},
	{
		name: ELEMENT_NAMES.voltageLevel,
		onClick: () => toggleFields('voltageLevel')
	},
	{
		name: ELEMENT_NAMES.bay,
		onClick: () => toggleFields('bay')
	},
	{
		name: ELEMENT_NAMES.ied,
		onClick: () => toggleFields('ied')
	},
	{
		name: ELEMENT_NAMES.lDevice,
		onClick: () => toggleFields('lDevice')
	}
]

//refs
let showFields = false
let currentFieldsToShow: string
let currentElementTypeAttributes: { [key: string]: string | null } = {}
let currentHtmlContext: HTMLElement

//==== FUNCTIONS ====//

function toggleFields(elementType: string) {
	showFields = true
	currentFieldsToShow = elementType
	currentElementTypeAttributes = {}
}

function handleInputChange(event: Event) {
	const target = event.target as HTMLInputElement
	currentElementTypeAttributes[target.name] = target.value
}

function addElement() {
	const currentElementTypeTag: DataTypeTemplates.AllowedTag = 'SubstationType'

	xmlDocumentStore.addElementToXmlDocument(
		currentElementTypeTag,
		currentElementTypeAttributes,
		currentHtmlContext
	)

	showFields = false
}
</script>
