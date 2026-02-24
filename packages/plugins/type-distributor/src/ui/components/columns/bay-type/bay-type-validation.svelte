<script lang="ts">
import {
	bayStore,
	equipmentMatchingStore,
	ssdImportStore
} from '@/headless/stores'
import { Button } from '@oscd-plugins/core-ui-svelte'
import EquipmentMatching from '@/ui/components/columns/bay-type/equipment-matching.svelte'

const {
	bayTypeError
}: {
	bayTypeError: string | null
} = $props()

const hasCountMismatches = $derived(
	(equipmentMatchingStore.validationResult?.errors?.length ?? 0) > 1
)

function handleApplyBayType() {
	if (!bayStore.selectedBay || !canApply) {
		return
	}

	try {
		bayStore.pendingBayTypeApply = ssdImportStore.selectedBayType
	} catch (error) {
		console.error('[handleApplyBayType] Error:', error)
	}
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
		scdBay.querySelectorAll('ConductingEquipment')
	)
	return allEquipment.filter((eq) => {
		const type = eq.getAttribute('type')
		return type && ambiguousTypeCodes.includes(type)
	}).length
})

const canApply = $derived.by(() => {
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
    {@const countErrors =
        equipmentMatchingStore.validationResult.errors.slice(1)}
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
{:else if equipmentMatchingStore.validationResult?.requiresManualMatching && !bayStore.pendingBayTypeApply}
    <EquipmentMatching />
{/if}

{#if equipmentMatchingStore.validationResult?.requiresManualMatching && !bayStore.pendingBayTypeApply && !hasCountMismatches}
    <Button.Root
        onclick={handleApplyBayType}
        disabled={!canApply}
        class="w-full"
    >
        Apply Bay Type
    </Button.Root>
{/if}
