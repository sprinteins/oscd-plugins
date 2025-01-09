<script lang="ts">
// COMPONENTS
import { Button, Input, Select } from '@oscd-plugins/core-ui-svelte'
// STORES
import { elementTypesStore } from '@/headless/stores/element-types.svelte'
// TYPES
import type {
	AvailableFamilies,
	Columns
} from '@/headless/stores/types.element-types'
import type { ItemsPerFamily } from './types.column'

//====== INITIALIZATION ======//

// props
const {
	columnKey,
	type,
	itemsPerFamily
}: {
	columnKey: keyof Columns
	type: 'input' | 'select'
	itemsPerFamily?: ItemsPerFamily
} = $props()

// constants
const families = {
	bay: {
		value: 'bay',
		label: 'Bay'
	},
	generalEquipment: {
		value: 'generalEquipment',
		label: 'GenEq'
	},
	conductingEquipment: {
		value: 'conductingEquipment',
		label: 'CondEq'
	},
	function: {
		value: 'function',
		label: 'Func'
	},
	eqFunction: {
		value: 'eqFunction',
		label: 'EqFunc'
	}
} as const

// binding
let newElementInput = $state('')
let newElementValue = $state('')
let newElementFamily = $state<AvailableFamilies>()

const newElementName = $derived.by(() => {
	if (type === 'select' && newElementFamily && itemsPerFamily)
		return `${triggerContentItems}${elementTypesStore.nextElementName[newElementFamily]}`

	if (!newElementInput && newElementFamily)
		return elementTypesStore.nextElementName[newElementFamily]

	return newElementInput
})

//====== REACTIVE VARIABLES ======//

const mappedFamilies = $derived(
	Object.keys(elementTypesStore.columns[columnKey].groupedElementTypes).map(
		(family) => families[family as AvailableFamilies]
	)
)

const triggerContentFamilies = $derived(
	mappedFamilies.find((family) => family.value === newElementFamily)?.label
)

const triggerContentItems = $derived.by<string>(() => {
	if (itemsPerFamily && newElementFamily) {
		const items = itemsPerFamily[newElementFamily]
		const selectedItem = items?.find(
			(item) => item.value === newElementValue
		)
		return selectedItem ? selectedItem.label : 'Select an equipment'
	}
	return 'Select an equipment'
})

const currentAttributes = $derived({
	name: newElementName,
	...(newElementValue && { type: newElementValue })
})
//====== FUNCTIONS ======//

async function handleAddNewElement() {
	if (!newElementFamily || !newElementName) return

	await elementTypesStore.createNewElementType(
		newElementFamily,
		currentAttributes
	)
	newElementInput = ''
	newElementValue = ''
}

//====== WATCHERS ======//

$effect(() => {
	if (!newElementFamily) newElementFamily = mappedFamilies[0].value
})
</script>

{#if mappedFamilies.length > 1 && columnKey !== 'lNodeType'}
	<Select.Root
		type="single"
		bind:value={newElementFamily}
	>
		<Select.Trigger class="truncate lg:max-w-24">{triggerContentFamilies}</Select.Trigger>
		<Select.Content>
			{#each mappedFamilies as family}
				<Select.Item value={family.value} label={family.label}>
					{family.label}
				</Select.Item>
			{/each}
		</Select.Content>
	</Select.Root>
{/if}

{#if type === 'input'}
	<Input.Root
		bind:value={newElementInput}
		placeholder={newElementName}
	/>
{:else if type === 'select' && newElementFamily && itemsPerFamily}
	<Select.Root
	type="single"
	bind:value={newElementValue}
	>
		<Select.Trigger class="truncate">{triggerContentItems}</Select.Trigger>
		<Select.Content>
			{#each itemsPerFamily[newElementFamily] as item}
				<Select.Item value={item.value} label={item.label}>
					{item.label}
				</Select.Item>
			{/each}
		</Select.Content>
	</Select.Root>
{/if}

<Button.Root
	class="w-full lg:w-auto"
	variant="ghost"
	onclick={handleAddNewElement}
	disabled={!(!!itemsPerFamily && !!newElementValue) && type === 'select'}
>
	Add
</Button.Root>