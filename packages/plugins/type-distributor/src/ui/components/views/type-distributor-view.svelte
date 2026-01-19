<script lang="ts">
import {
	Card,
	SelectWorkaround,
} from '@oscd-plugins/core-ui-svelte'
import { bayTypesStore, bayStore } from '@/headless/stores'
import type { BayType } from '@/headless/types'
import { BayTypeDetails } from '@/ui/components'
import { getSIEDs } from '@/headless/ied'
import SIedDetails from '../s-ied-details.svelte'
import { AddSIedApDialogTrigger } from '../s-ied-ap';

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
        <SIedDetails sIedItems={getSIEDs(bayStore.selectedBay ?? "")} />
        <AddSIedApDialogTrigger />
      </div>
    </Card.Content>
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
        <BayTypeDetails {functionTemplates} {conductingEquipmentTemplates} />
      {:else}
        <p class="text-gray-500 text-sm">Select a bay type to see details</p>
      {/if}
    </Card.Content>
  </Card.Root>
</div>
