<script lang="ts">
import {
	Card,
	pluginGlobalStore,
	SelectWorkaround
} from '@oscd-plugins/core-ui-svelte'
import { bayStore, bayTypesStore } from '@/headless/stores'
import type { BayType } from '@/headless/common-types'
import { BayTypeDetails, BayTypeValidation } from '@/ui/components/columns/bay-type'
import { getSIEDs } from '@/headless/ied'
import SIedDetails from '@/ui/components/columns/s-ied/s-ied-details.svelte'
import { AddSIedApDialogTrigger } from '@/ui/components/columns/s-ied/create-ied-ap-dialog'
import { validateBayTypeSelection } from '@/headless/matching'

const bayTypeOptions = $derived(
	bayTypesStore.bayTypes.map((bt: BayType) => ({
		value: bt.uuid,
		label: bt.name
	}))
)
const bayTypeWithTemplates = $derived(
	bayTypesStore.selectedBayType
		? bayTypesStore.getBayTypeWithTemplates(bayTypesStore.selectedBayType)
		: null
)
const functionTemplates = $derived(
	bayTypeWithTemplates?.functionTemplates ?? []
)
const conductingEquipmentTemplates = $derived(
	bayTypeWithTemplates?.conductingEquipmentTemplates ?? []
)

const sIedItems = $derived.by(() => {
	pluginGlobalStore.editCount
	return getSIEDs(bayStore.selectedBay ?? '')
})

let bayTypeError = $state<string | null>(null)

function handleBayTypeChange() {
	bayTypeError = null

	if (!bayStore.selectedBay) {
		bayTypeError = 'No Bay selected'
		return
	}

	try {
		validateBayTypeSelection(bayStore.selectedBay)
	} catch (error) {
		console.error('[handleBayTypeChange] Error:', error)
	}
}
</script>

<div class="grid grid-cols-3 gap-4 w-full h-full p-4 overflow-hidden">
	<Card.Root class="flex-1 flex flex-col min-h-full">
		<Card.Header>
			<Card.Title>SLD</Card.Title>
		</Card.Header>
	</Card.Root>
	<Card.Root class="flex-1 flex flex-col min-h-full">
		<Card.Header>
			<Card.Title>S-IEDs</Card.Title>
		</Card.Header>
		<Card.Content class="flex-1 overflow-y-auto">
			<div class="flex flex-col gap-y-4 justify-between">
				<SIedDetails {sIedItems} />
				<AddSIedApDialogTrigger />
			</div>
		</Card.Content>
	</Card.Root>
	<Card.Root class="flex-1 flex flex-col min-h-full">
		<Card.Header>
			<SelectWorkaround
				disabled={bayTypeOptions.length === 0}
				bind:value={bayTypesStore.selectedBayType}
				handleChange={handleBayTypeChange}
				options={bayTypeOptions}
				placeholder="Select Bay Type"
				class="w-full"
			/>
		</Card.Header>
		<Card.Content class="overflow-y-auto space-y-4">
			<BayTypeValidation {bayTypeError} />

			{#if bayTypeWithTemplates}
				<BayTypeDetails
					{functionTemplates}
					{conductingEquipmentTemplates}
				/>
			{:else}
				<p class="text-gray-500 text-sm">
					Select a bay type to see details
				</p>
			{/if}
		</Card.Content>
	</Card.Root>
</div>
