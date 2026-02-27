<script lang="ts">
import { equipmentMatchingStore } from '@/headless/stores'

const validationResult = $derived(equipmentMatchingStore.validationResult)
</script>

{#if validationResult?.requiresManualMatching}
    <p class="text-sm text-amber-600 mt-2">
        Manual matching required: Multiple equipment templates with the same
        type found.
    </p>
    {#if validationResult.ambiguousTypes && validationResult.ambiguousTypes.length > 0}
        <p class="text-xs text-gray-600 mt-1">
            Ambiguous types: {validationResult.ambiguousTypes
                .map(
                    (info) =>
                        `${info.typeCode} (${info.templateNames.join(", ")})`,
                )
                .join(", ")}
        </p>
    {/if}
{/if}
