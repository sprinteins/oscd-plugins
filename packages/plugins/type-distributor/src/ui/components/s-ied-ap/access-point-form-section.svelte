<script lang="ts">
import { Label, Input } from '@oscd-plugins/core-ui-svelte'

let {
	name = $bindable(''),
	description = $bindable(''),
	disabled = false,
	isRequired = false
}: {
	name: string
	description: string
	disabled?: boolean
	isRequired?: boolean
} = $props()
</script>

<section>
	<header class="pb-4">
		<h1 class="text-xl font-bold">Add Access Point</h1>
	</header>
	<div class="space-y-3">
		<div class="space-y-2">
			<Label.Root for="ap-name">Name{isRequired ? ' *' : ''}</Label.Root>
			<Input.Root
				id="ap-name"
				bind:value={name}
				placeholder="Enter Access Point name"
				{disabled}
			/>
		</div>
		<div class="space-y-2">
			<Label.Root for="ap-desc">Description</Label.Root>
			<Input.Root
				id="ap-desc"
				bind:value={description}
				placeholder="Enter Access Point description (optional)"
				disabled={disabled || !name}
			/>
		</div>
	</div>
</section>
