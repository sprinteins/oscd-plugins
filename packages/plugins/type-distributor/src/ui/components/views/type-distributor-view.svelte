<script lang="ts">
import { Card, SelectWorkaround } from '@oscd-plugins/core-ui-svelte'
import { bayTypesStore } from '@/headless/stores'
import type { BayType } from '@/headless/types'
import { BayTypeDetails } from '@/ui/components'

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
	(bayTypeWithTemplates?.functionTemplates ?? []).filter(
		(t): t is NonNullable<typeof t> => t != null
	)
)
const conductingEquipmentTemplates = $derived(
	(bayTypeWithTemplates?.conductingEquipmentTemplates ?? []).filter(
		(t): t is NonNullable<typeof t> => t != null
	)
)
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
    </Card.Root>
    <Card.Root class="flex-1 flex flex-col min-h-full">
        <Card.Header>
            <SelectWorkaround
                bind:value={bayTypesStore.selectedBayType}
                options={bayTypeOptions}
                placeholder="Select Bay Type"
                class="w-full"
            />
        </Card.Header>
        <Card.Content class="overflow-y-auto">
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
