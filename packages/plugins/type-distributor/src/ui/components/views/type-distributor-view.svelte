<script lang="ts">
import {
	Card,
	SelectWorkaround,
	Button,
	Input,
	Label
} from '@oscd-plugins/core-ui-svelte'
import { bayTypesStore, bayStore } from '@/headless/stores'
import type { BayType } from '@/headless/types'
import { BayTypeDetails } from '@/ui/components'
import { createSIED, getSIEDs } from '@/headless/ied'
import SIedDetails from '../s-ied-details.svelte'

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

// Placeholder for IED creation form
// IED creation state
let iedName = $state('')
let iedDesc = $state('')
let isCreatingIED = $state(false)
let iedCreationError = $state<string | null>(null)

function handleCreateIED() {
	// Reset error
	iedCreationError = null

	// Validate name
	if (!iedName.trim()) {
		iedCreationError = 'IED name is required'
		return
	}

	try {
		isCreatingIED = true
		createSIED(iedName.trim(), iedDesc.trim() || undefined)

		// Reset form on success
		iedName = ''
		iedDesc = ''
	} catch (error) {
		iedCreationError =
			error instanceof Error ? error.message : 'Failed to create IED'
	} finally {
		isCreatingIED = false
	}
}

$effect(() => {
  console.log('Selected Bay Type:', bayTypesStore.selectedBayType)
})
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
        <div class="space-y-4">
          <div class="space-y-3">
            <div class="space-y-2">
              <Label.Root for="ied-name">Name *</Label.Root>
              <Input.Root
                id="ied-name"
                bind:value={iedName}
                placeholder="Enter IED name"
                disabled={isCreatingIED}
              />
            </div>
            <div class="space-y-2">
              <Label.Root for="ied-desc">Description</Label.Root>
              <Input.Root
                id="ied-desc"
                bind:value={iedDesc}
                placeholder="Enter IED description (optional)"
                disabled={isCreatingIED}
              />
            </div>
            {#if iedCreationError}
              <p class="text-sm text-red-600">{iedCreationError}</p>
            {/if}
            <Button.Root
              onclick={handleCreateIED}
              disabled={isCreatingIED || !iedName.trim()}
              class="w-full"
            >
              {isCreatingIED ? "Creating..." : "Create IED"}
            </Button.Root>
          </div>
        </div>
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
