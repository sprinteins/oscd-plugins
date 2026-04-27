<script lang="ts">
import {
	Button,
	Card,
	pluginGlobalStore,
	SelectWorkaround
} from '@oscd-plugins/core-ui-svelte'
import { untrack } from 'svelte'
import { validateBayType } from '@/headless/actions'
import type { BayType } from '@/headless/common-types'
import { getScdEquipmentMatchKey } from '@/headless/domain/matching'
import { queryIEDs, type SearchType } from '@/headless/scl'
import {
	assignedLNodesStore,
	bayStore,
	equipmentMatchingStore,
	getBayTypeWithTemplates,
	ssdImportStore
} from '@/headless/stores'
import {
	BayTypeDetails,
	BayTypeValidation
} from '@/ui/components/columns/bay-type'
import { IedDetails, IedSearch } from '@/ui/components/columns/s-ied'
import { AddIedApDialogTrigger } from '@/ui/components/columns/s-ied/create-ied-ap-dialog'

let searchTerm = $state('')
let searchType = $state<SearchType>('IED')

const bayTypeOptions = $derived(
	ssdImportStore.bayTypes.map((bt: BayType) => ({
		value: bt.uuid,
		label: bt.name
	}))
)

const activeBayTypeUuid = $derived(
	bayStore.assignedBayTypeUuid || ssdImportStore.selectedBayType
)

const bayTypeWithTemplates = $derived(
	activeBayTypeUuid ? getBayTypeWithTemplates(activeBayTypeUuid) : null
)

const functionTemplates = $derived(
	bayTypeWithTemplates?.functionTemplates ?? []
)

const conductingEquipmentTemplates = $derived(
	bayTypeWithTemplates?.conductingEquipmentTemplates ?? []
)

const iedItems = $derived.by(() => {
	pluginGlobalStore.editCount
	return queryIEDs(bayStore.selectedBay ?? '')
})

$effect(() => {
	pluginGlobalStore.editCount
	assignedLNodesStore.rebuild()
})

const isUserSelectingDifferentBayType = $derived(
	!!ssdImportStore.selectedBayType &&
		ssdImportStore.selectedBayType !== bayStore.assignedBayTypeUuid
)

$effect(() => {
	const currentBay = bayStore.selectedBay
	untrack(() => {
		equipmentMatchingStore.clearValidationResult()
		equipmentMatchingStore.clearManualMatches()
		bayStore.manualMatchingConfirmed = false

		if (!currentBay) return

		const bayTypeUuid =
			bayStore.assignedBayTypeUuid ?? ssdImportStore.selectedBayType
		if (!bayTypeUuid) return

		try {
			validateBayType()
		} catch (_error) {}

		if (
			assignedLNodesStore.hasConnections &&
			equipmentMatchingStore.validationResult?.requiresManualMatching
		) {
			bayStore.manualMatchingConfirmed = true
		}
	})
})

const isBayTypeLocked = $derived(assignedLNodesStore.hasConnections)

const canReopenMatching = $derived(bayStore.manualMatchingConfirmed)

function prefillManualMatchesFromBay() {
	const bay = bayStore.scdBay
	if (!bay) return

	equipmentMatchingStore.manualMatches.clear()

	const scdEquipment = Array.from(
		bay.querySelectorAll(':scope > ConductingEquipment')
	)
	for (const [index, eq] of scdEquipment.entries()) {
		const originUuid = eq.getAttribute('originUuid')?.trim()
		if (!originUuid) continue
		const key = getScdEquipmentMatchKey(eq, index)
		equipmentMatchingStore.manualMatches.set(key, originUuid)
	}
}

function handleReopenMatching() {
	if (isBayTypeLocked) {
		prefillManualMatchesFromBay()
	}
	bayStore.manualMatchingConfirmed = false
}

let bayTypeError = $state<string | null>(null)

const hasBlockingValidationError = $derived.by(() => {
	const validation = equipmentMatchingStore.validationResult
	return (
		validation !== null &&
		!validation.isValid &&
		!validation.requiresManualMatching
	)
})

const isShowingManualMatchingUI = $derived(
	equipmentMatchingStore.validationResult?.requiresManualMatching === true &&
		!bayStore.manualMatchingConfirmed
)

const shouldShowBayTypeDetails = $derived.by(() => {
	if (
		bayStore.assignedBayTypeUuid &&
		!isUserSelectingDifferentBayType &&
		!isShowingManualMatchingUI
	) {
		return true
	}
	return (
		bayTypeWithTemplates !== null &&
		!hasBlockingValidationError &&
		!isShowingManualMatchingUI
	)
})

function handleBayTypeChange() {
	bayTypeError = null
	equipmentMatchingStore.reset()
	bayStore.manualMatchingConfirmed = false

	if (!bayStore.selectedBay) {
		bayTypeError = 'No Bay selected'
		return
	}

	try {
		validateBayType()
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
	<Card.Root class="flex-1 flex flex-col min-h-full gap-y-4">
		<Card.Header>
			<Card.Title>S-IEDs</Card.Title>
			<div class="pt-4">
				<IedSearch bind:searchTerm bind:searchType />
			</div>
		</Card.Header>
		<Card.Content class="flex-1 overflow-y-auto py-0">
			<IedDetails {iedItems} {searchTerm} {searchType} />
		</Card.Content>
		<Card.Footer>
			<AddIedApDialogTrigger />
		</Card.Footer>
	</Card.Root>
	<Card.Root class="flex-1 flex flex-col min-h-full">
		<Card.Header>
			<div class="flex items-center gap-2">
				<SelectWorkaround
					disabled={bayTypeOptions.length === 0 || isBayTypeLocked || bayStore.selectedBay === null}
					bind:value={ssdImportStore.selectedBayType}
					handleChange={handleBayTypeChange}
					options={bayTypeOptions}
					placeholder="Select Bay Type"
					class="flex-1"
				/>
				{#if canReopenMatching}
					<Button.Root variant="outline" onclick={handleReopenMatching}>
						Edit Matching
					</Button.Root>
				{/if}
			</div>
		</Card.Header>
		<Card.Content class="flex-1 flex flex-col overflow-hidden">
			<div class="flex-1 flex flex-col gap-y-4 overflow-y-auto">
				<BayTypeValidation {bayTypeError} />
				{#if shouldShowBayTypeDetails}
					<BayTypeDetails
						{functionTemplates}
						{conductingEquipmentTemplates}
						{bayTypeWithTemplates}
					/>
				{:else if ssdImportStore.bayTypes.length === 0}
					<p class="text-gray-500 text-sm">
						Import a ssd file.
					</p>
				{:else if !ssdImportStore.selectedBayType && bayStore.selectedBay !== null}
					<p class="text-gray-500 text-sm">
						Select a bay type to see details.
					</p>
				{:else if bayStore.selectedBay === null}
					<p class="text-gray-500 text-sm">
						Select a bay to assign a bay type.
					</p>
				{/if}
			</div>
		</Card.Content>
	</Card.Root>
</div>