<script lang="ts">
import { Input, Label } from '@oscd-plugins/core-ui-svelte'
import { FieldError } from '../form-elements'
import type { AccessPointData, FieldErrors } from '../form-helpers'

let {
	accessPoint = $bindable({ name: '', description: '' }),
	isRequired,
	disabled = false,
	errors = undefined
}: {
	accessPoint: AccessPointData
	isRequired: boolean
	disabled?: boolean
	errors?: FieldErrors
} = $props()
</script>

<section>
  <header class="pb-4">
    <h1 class="text-xl font-bold">Add Access Point</h1>
  </header>
  <div class="space-y-3">
    <div class="space-y-2">
      <Label.Root for="ap-name">Name {isRequired ? '*' : ''}</Label.Root>
      <Input.Root
        id="ap-name"
        bind:value={accessPoint.name}
        placeholder="Enter Access Point name"
        {disabled}
      />
      <FieldError errors={errors?.properties?.name?.errors ?? errors?.errors} />
    </div>
    <div class="space-y-2">
      <Label.Root for="ap-desc">Description</Label.Root>
      <Input.Root
        id="ap-desc"
        bind:value={accessPoint.description}
        placeholder="Enter Access Point description (optional)"
        disabled={disabled || !accessPoint.name}
      />
      <FieldError errors={errors?.properties?.description?.errors} />
    </div>
  </div>
</section>
