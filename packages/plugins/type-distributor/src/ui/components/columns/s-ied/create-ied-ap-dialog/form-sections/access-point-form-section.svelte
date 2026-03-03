<script lang="ts">
import { Label, Input } from '@oscd-plugins/core-ui-svelte'
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
      {#if errors?.name}
        <p class="text-sm text-red-600">{errors.name}</p>
      {/if}
    </div>
    <div class="space-y-2">
      <Label.Root for="ap-desc">Description</Label.Root>
      <Input.Root
        id="ap-desc"
        bind:value={accessPoint.description}
        placeholder="Enter Access Point description (optional)"
        disabled={disabled || !accessPoint.name}
      />
      {#if errors?.description}
        <p class="text-sm text-red-600">{errors.description}</p>
      {/if}
    </div>
  </div>
</section>
