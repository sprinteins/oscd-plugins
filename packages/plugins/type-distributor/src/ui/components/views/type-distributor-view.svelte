<script lang="ts">
import {
	Card,
	pluginGlobalStore,
	SelectWorkaround
} from '@oscd-plugins/core-ui-svelte'
import {
	bayStore,
	bayTypesStore,
	equipmentMatchingStore,
	assignedLNodesStore
} from '@/headless/stores'
import type { BayType } from '@/headless/common-types'
import {
	BayTypeDetails,
	BayTypeValidation
} from '@/ui/components/columns/bay-type'
import { querySIEDs } from '@/headless/ied'
import SIedDetails from '@/ui/components/columns/s-ied/s-ied-details.svelte'
import { AddIedApDialogTrigger } from '@/ui/components/columns/s-ied/create-ied-ap-dialog'
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
	return querySIEDs(bayStore.selectedBay ?? '')
})

$effect(() => {
	pluginGlobalStore.editCount
	assignedLNodesStore.rebuild()
})

$effect(() => {
	if (bayStore.assignedBayTypeUuid) {
		bayTypesStore.selectedBayType = bayStore.assignedBayTypeUuid
	} else {
		bayTypesStore.selectedBayType = null
	}
})

const isBayTypeLocked = $derived(assignedLNodesStore.hasConnections)

let bayTypeError = $state<string | null>(null)

const shouldShowBayTypeDetails = $derived.by(() => {
	if (!bayTypeWithTemplates) return false

	const validation = equipmentMatchingStore.validationResult

	if (
		validation &&
		!validation.isValid &&
		!validation.requiresManualMatching
	) {
		return false
	}

	if (bayStore.assignedBayTypeUuid === bayTypesStore.selectedBayType) {
		return true
	}

	return !!bayStore.pendingBayTypeApply
})

function handleBayTypeChange() {
	bayTypeError = null
	equipmentMatchingStore.reset()

	if (!bayStore.selectedBay) {
		bayTypeError = 'No Bay selected'
		return
	}

	try {
		const validation = validateBayTypeSelection(bayStore.selectedBay)

		if (validation.isValid && !validation.requiresManualMatching) {
			bayStore.pendingBayTypeApply = bayTypesStore.selectedBayType
		}
		assignedLNodesStore.rebuild()
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
		<Card.Content class="flex-1 flex flex-col gap-y-4 overflow-hidden">
			<div class="flex-1 overflow-y-auto">
				<SIedDetails {sIedItems} />
			</div>
			<div>
				<AddIedApDialogTrigger />
			</div>
		</Card.Content>
	</Card.Root>
	<Card.Root class="flex-1 flex flex-col min-h-full">
		<Card.Header>
			<SelectWorkaround
				disabled={bayTypeOptions.length === 0 || isBayTypeLocked}
				bind:value={bayTypesStore.selectedBayType}
				handleChange={handleBayTypeChange}
				options={bayTypeOptions}
				placeholder="Select Bay Type"
				class="w-full"
			/>
		</Card.Header>
		<Card.Content class="flex-1 flex flex-col overflow-hidden">
			<div  class="flex-1 flex flex-col gap-y-4 overflow-y-auto">
				<BayTypeValidation {bayTypeError} />
				{#if shouldShowBayTypeDetails}
					<BayTypeDetails
						{functionTemplates}
						{conductingEquipmentTemplates}
						{bayTypeWithTemplates}
					/>
				{:else if !bayTypesStore.selectedBayType}
					<p class="text-gray-500 text-sm">
						Select a bay type to see details
					</p>
				{/if}
			</div>
		</Card.Content>
	</Card.Root>
</div>
