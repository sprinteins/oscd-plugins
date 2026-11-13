<script lang="ts">
import {
	Checkbox,
	Input,
	Label,
	SelectWorkaround
} from '@oscd-plugins/core-ui-svelte'
import { FieldError } from '../form-elements'
import type { AccessPointData, FieldErrors } from '../form-helpers'

const id = $props.id()

let {
	accessPoint = $bindable({
		name: '',
		description: '',
		serverAtApName: ''
	}),
	serverAtOptions,
	isRequired,
	disabled = false,
	errors = undefined
}: {
	accessPoint: AccessPointData
	serverAtOptions: { value: string; label: string }[]
	isRequired: boolean
	disabled?: boolean
	errors?: FieldErrors
} = $props()

function handleServerAtTargetChange(event: Event) {
	if (event.target instanceof HTMLSelectElement) {
		accessPoint.serverAtApName = event.target.value
	}
}
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
    <div class="flex items-center gap-2">
      <Checkbox.Root
        id={`${id}-server-at`}
        checked={Boolean(accessPoint.serverAtApName)}
        disabled={
          disabled ||
          (serverAtOptions.length === 0 && !accessPoint.serverAtApName)
        }
        onCheckedChange={(checked) => {
          accessPoint.serverAtApName =
            checked === true ? serverAtOptions[0]?.value ?? '' : ''
        }}
      />
      <Label.Root for={`${id}-server-at`}>Share a Server using ServerAt</Label.Root>
    </div>
    {#if serverAtOptions.length === 0}
      <p class="text-sm text-muted-foreground">
        No Access Point with a Server is available.
      </p>
    {/if}
    {#if accessPoint.serverAtApName}
      <div class="block space-y-2">
        <Label.Root for={`${id}-server-at-target`}>
          Server provided by
        </Label.Root>
        <SelectWorkaround
          id={`${id}-server-at-target`}
          value={accessPoint.serverAtApName}
          options={serverAtOptions}
          handleChange={handleServerAtTargetChange}
          placeholder="Select an Access Point"
          disabled={disabled}
          class="w-full"
        />
      </div>
    {/if}
  </div>
</section>
