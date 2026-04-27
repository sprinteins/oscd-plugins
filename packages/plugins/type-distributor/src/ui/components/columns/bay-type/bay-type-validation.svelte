<script lang="ts">
import { Button } from '@oscd-plugins/core-ui-svelte'
import { reMatchEquipment } from '@/headless/actions'
import {
	assignedLNodesStore,
	bayStore,
	equipmentMatchingStore,
	ssdImportStore
} from '@/headless/stores'
import EquipmentMatching from '@/ui/components/columns/bay-type/equipment-matching.svelte'

const {
	bayTypeError
}: {
	bayTypeError: string | null
} = $props()

const hasCountMismatches = $derived(
	(equipmentMatchingStore.validationResult?.countMismatchErrors?.length ??
		0) > 0
)

function handleConfirmMatching() {
	if (!bayStore.selectedBay || !canConfirm) {
		return
	}

	if (isBayTypeLocked) {
		reMatchEquipment(bayStore.selectedBay)
	}

	bayStore.manualMatchingConfirmed = true
}

const scdBay = $derived(bayStore.scdBay)

const ambiguousTypeCodes = $derived.by(() => {
	const ambiguousTypes =
		equipmentMatchingStore.validationResult?.ambiguousTypes
	if (!ambiguousTypes) return []
	return ambiguousTypes.map((info) => info.typeCode)
})

const ambiguousEquipmentCount = $derived.by(() => {
	if (!scdBay || ambiguousTypeCodes.length === 0) return 0

	const allEquipment = Array.from(
		scdBay.querySelectorAll(':scope > ConductingEquipment')
	)
	return allEquipment.filter((eq) => {
		const type = eq.getAttribute('type')
		return type && ambiguousTypeCodes.includes(type)
	}).length
})

const isBayTypeLocked = $derived(assignedLNodesStore.hasConnections)

const canConfirm = $derived.by(() => {
	if (
		!ssdImportStore.selectedBayType ||
		!equipmentMatchingStore.validationResult
	) {
		return false
	}

	const validation = equipmentMatchingStore.validationResult

	if (!validation.requiresManualMatching) {
		return validation.isValid
	}

	if (!scdBay) return false

	return (
		equipmentMatchingStore.manualMatches.size >= ambiguousEquipmentCount &&
		equipmentMatchingStore.templateCountsValid
	)
})

const showManualMatchingUI = $derived(
	equipmentMatchingStore.validationResult?.requiresManualMatching &&
		!bayStore.manualMatchingConfirmed &&
		!hasCountMismatches
)
</script>

{#if bayTypeError}
    <div
        class="p-3 bg-red-50 border border-red-200 rounded text-sm text-red-700"
    >
        {bayTypeError}
    </div>
{/if}

{#if equipmentMatchingStore.validationResult && !equipmentMatchingStore.validationResult.isValid && !equipmentMatchingStore.validationResult.requiresManualMatching}
    <div class="p-3 bg-red-50 border border-red-200 rounded">
        <p class="text-sm font-semibold text-red-700 mb-2">
            Validation Errors:
        </p>
        <ul class="text-sm text-red-600 space-y-1">
            {#each equipmentMatchingStore.validationResult.errors as error}
                <li>• {error}</li>
            {/each}
        </ul>
    </div>
{/if}

{#if hasCountMismatches && equipmentMatchingStore.validationResult}
    {@const countErrors = equipmentMatchingStore.validationResult.countMismatchErrors ?? []}
    <div class="p-3 bg-amber-50 border border-amber-200 rounded mb-4">
        <p class="text-sm font-semibold text-amber-700 mb-2">
            Equipment count mismatches:
        </p>
        <ul class="text-sm text-amber-600 space-y-1">
            {#each countErrors as error}
                <li>• {error}</li>
            {/each}
        </ul>
    </div>
{:else if equipmentMatchingStore.validationResult?.requiresManualMatching && !bayStore.manualMatchingConfirmed}
    <EquipmentMatching />
{/if}

{#if showManualMatchingUI}
    <Button.Root
        onclick={handleConfirmMatching}
        disabled={!canConfirm}
        class="w-full"
    >
        Confirm Matching
    </Button.Root>
{/if}
