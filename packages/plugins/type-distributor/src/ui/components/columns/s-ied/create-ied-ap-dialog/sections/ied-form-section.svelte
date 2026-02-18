<script lang="ts">
import { Label, Input } from '@oscd-plugins/core-ui-svelte'
import type { IedData } from '../lib'

let {
	ied = $bindable({ name: '', description: '', isNew: true }),
	disabled = false
}: { ied: IedData; disabled?: boolean } = $props()
</script>

<section>
  <header class="pb-4">
    <h1 class="text-xl font-bold">Create New IED</h1>
  </header>
  <div class="space-y-3">
    <div class="space-y-2">
      <Label.Root for="ied-name">Name *</Label.Root>
      <Input.Root
        id="ied-name"
        bind:value={ied.name}
        placeholder="Enter IED name"
        {disabled}
      />
    </div>
    <div class="space-y-2">
      <Label.Root for="ied-desc">Description</Label.Root>
      <Input.Root
        id="ied-desc"
        bind:value={ied.description}
        placeholder="Enter IED description (optional)"
        {disabled}
      />
    </div>
  </div>
</section>
