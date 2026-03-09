<script lang="ts">
import { Label, Input } from '@oscd-plugins/core-ui-svelte'
import type { AccessPointData, FieldErrors } from '../form-helpers'
import type { FunctionTemplate } from '@/headless/common-types'
import { FieldError } from '../form-elements'
import Ld0FormSection from './ld0-form-section.svelte'

let {
	accessPoint = $bindable({ name: '', description: '', ld0Source: { kind: 'default', onlyMandatoryDOs: false } }),
	ld0FunctionTemplates,
	isRequired,
	disabled = false,
	errors = undefined
}: {
	accessPoint: AccessPointData
	ld0FunctionTemplates: FunctionTemplate[]
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
    <Ld0FormSection {ld0FunctionTemplates} bind:source={accessPoint.ld0Source} disabled={!accessPoint.name} />
  </div>
</section>
