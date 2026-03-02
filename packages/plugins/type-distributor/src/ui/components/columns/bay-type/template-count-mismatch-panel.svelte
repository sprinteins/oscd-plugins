<script lang="ts">
import type { TemplateCountMismatch } from '@/headless/matching/types'
import { ssdImportStore } from '@/headless/stores'

interface Props {
	templateCountMismatch: TemplateCountMismatch[]
}

let { templateCountMismatch }: Props = $props()
</script>

<div class="mt-2 p-2 bg-red-50 border border-red-200 rounded">
    <p class="text-xs font-semibold text-red-700 mb-1">
        Template count mismatch:
    </p>
    {#each templateCountMismatch as mismatch}
        {@const template = ssdImportStore.getConductingEquipmentTemplate(mismatch.templateUuid)}
        {#if template}
            <div class="text-xs text-red-600">
                <span class="font-medium"
                    >{template.name} ({template.type}):</span
                >
                {mismatch.selected}/{mismatch.required}
            </div>
        {/if}
    {/each}
</div>
