<script lang="ts">
import { Input, Label } from '@oscd-plugins/core-ui-svelte'
import { FieldError } from '../form-elements'
import type { FieldErrors, IedData } from '../form-helpers'

let {
	ied = $bindable({ name: '', description: '', isNew: true }),
	disabled = false,
	errors = undefined
}: { ied: IedData; disabled?: boolean; errors?: FieldErrors } = $props()
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
      <FieldError errors={errors?.properties?.name?.errors} />
    </div>
    <div class="space-y-2">
      <Label.Root for="ied-desc">Description</Label.Root>
      <Input.Root
        id="ied-desc"
        bind:value={ied.description}
        placeholder="Enter IED description (optional)"
        {disabled}
      />
      <FieldError errors={errors?.properties?.description?.errors} />
    </div>
  </div>
</section>
