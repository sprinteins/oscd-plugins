<script lang="ts">
import { Input, Label } from '@oscd-plugins/core-ui-svelte'
import { FieldError } from '@/ui/components/columns/s-ied/create-ied-ap-dialog/form-elements'
import type { FieldErrors, IedRenameData } from '../form-helpers'

let {
	ied = $bindable({ name: '', description: '' }),
	errors = undefined
}: {
	ied: IedRenameData
	errors?: FieldErrors
} = $props()
</script>

<section>
  <header class="pb-4">
    <h1 class="text-xl font-bold">Rename S-IED</h1>
  </header>
  <div class="space-y-3">
    <div class="space-y-2">
      <Label.Root for="ied-rename-name">Name *</Label.Root>
      <Input.Root id="ied-rename-name" bind:value={ied.name} placeholder="Enter IED name" />
      <FieldError errors={errors?.properties?.name?.errors} />
    </div>
    <div class="space-y-2">
      <Label.Root for="ied-rename-desc">Description</Label.Root>
      <Input.Root id="ied-rename-desc" bind:value={ied.description} placeholder="Enter IED description (optional)" />
      <FieldError errors={errors?.properties?.description?.errors} />
    </div>
  </div>
</section>
