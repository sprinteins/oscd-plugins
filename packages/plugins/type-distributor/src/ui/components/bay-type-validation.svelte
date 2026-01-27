<script lang="ts">
import {
	bayStore,
	bayTypesStore,
	equipmentMatchingStore
} from '@/headless/stores'
import { Button } from '@oscd-plugins/core-ui-svelte'
import EquipmentMatching from '@/ui/components/equipment-matching.svelte'
import { getDocumentAndEditor, getBayElement } from '@/headless/distribution'

const {
	bayTypeError,
	onApply
}: {
	bayTypeError: string | null
	onApply: () => void
} = $props()

// TODO: Maybe make this available in the store? But need to make sure it updates correctly
function getScdBay(): Element | null {
	if (!bayStore.selectedBay) {
		return null
	}
	try {
		const { doc } = getDocumentAndEditor()
		const bay = getBayElement(doc, bayStore.selectedBay)
		return bay
	} catch (error) {
		return null
	}
}

const canApply = $derived.by(() => {
	if (
		!bayTypesStore.selectedBayType ||
		!equipmentMatchingStore.validationResult?.isValid
	) {
		return false
	}

	if (!equipmentMatchingStore.validationResult?.requiresManualMatching) {
		return true
	}

	const bay = getScdBay()
	if (!bay) return false

	// TODO: Refactor we do not want Regex here
	// Count equipment with ambiguous types - use snapshot to avoid proxy issues
	// ambiguousTypes contains strings like "DIS (Disconnector, Earth Switch)"
	// We need to extract just the type part before the parenthesis
	const ambiguousTypesRaw =
		$state.snapshot(
			equipmentMatchingStore.validationResult?.ambiguousTypes
		) || []
	const ambiguousTypes = ambiguousTypesRaw.map((typeStr) => {
		const match = typeStr.match(/^([^\s(]+)/)
		return match ? match[1] : typeStr
	})

	const allEquipment = Array.from(bay.querySelectorAll('ConductingEquipment'))
	const ambiguousEquipmentCount = allEquipment.filter((eq) => {
		const type = eq.getAttribute('type')
		return type && ambiguousTypes.includes(type)
	}).length

	return equipmentMatchingStore.areAllManualMatchesSet(
		ambiguousEquipmentCount
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

{#if bayStore.selectedBay && bayTypesStore.selectedBayType && equipmentMatchingStore.validationResult?.requiresManualMatching}
    {@const bay = getScdBay()}
    {#if equipmentMatchingStore.validationResult.errors.length > 0}
        <div class="p-3 bg-amber-50 border border-amber-200 rounded mb-4">
            <p class="text-sm font-semibold text-amber-700 mb-2">
                Please match the equipment manually:
            </p>
            <ul class="text-sm text-amber-600 space-y-1">
                {#each equipmentMatchingStore.validationResult.errors as error}
                    <li>• {error}</li>
                {/each}
            </ul>
        </div>
    {/if}
    {#if bay}
        <EquipmentMatching
            scdBay={bay}
            bayTypeUuid={bayTypesStore.selectedBayType}
        />
    {:else}
        <div class="p-3 bg-yellow-50 border border-yellow-200 rounded">
            <p class="text-sm text-yellow-700">
                Unable to load bay element for matching
            </p>
        </div>
    {/if}
{/if}

{#if bayTypesStore.selectedBayType && equipmentMatchingStore.validationResult?.isValid}
    <Button.Root onclick={onApply} disabled={!canApply} class="w-full">
        Apply Bay Type
    </Button.Root>
{/if}
