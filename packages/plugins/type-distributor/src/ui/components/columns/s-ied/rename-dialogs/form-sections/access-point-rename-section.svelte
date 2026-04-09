<script lang="ts">
import { Input, Label } from '@oscd-plugins/core-ui-svelte'
import { FieldError } from '@/ui/components/columns/s-ied/create-ied-ap-dialog/form-elements'
import type { AccessPointData, FieldErrors } from '../form-helpers'

let {
	accessPoint = $bindable({ name: '', description: '' }),
	errors = undefined
}: {
	accessPoint: AccessPointData
	errors?: FieldErrors
} = $props()
</script>

<section>
  <header class="pb-4">
    <h1 class="text-xl font-bold">Rename Access Point</h1>
  </header>
  <div class="space-y-3">
    <div class="space-y-2">
      <Label.Root for="ap-rename-name">Name *</Label.Root>
      <Input.Root id="ap-rename-name" bind:value={accessPoint.name} placeholder="Enter Access Point name" />
      <FieldError errors={errors?.properties?.name?.errors} />
    </div>
    <div class="space-y-2">
      <Label.Root for="ap-rename-desc">Description</Label.Root>
      <Input.Root id="ap-rename-desc" bind:value={accessPoint.description} placeholder="Enter Access Point description (optional)" />
      <FieldError errors={errors?.properties?.description?.errors} />
    </div>
  </div>
</section>
