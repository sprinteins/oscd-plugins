<script lang="ts">
import { SelectWorkaround } from '@oscd-plugins/core-ui-svelte'

let {
	selectedIedName = $bindable(),
	options,
	disabled = false
}: {
	selectedIedName: string
	options: { value: string; label: string }[]
	disabled?: boolean
} = $props()
</script>

<section>
	<header class="pb-4">
		<h1 class="text-xl font-bold">Select existing S-IED</h1>
	</header>
	<div class="space-y-2">
		<SelectWorkaround
			bind:value={selectedIedName}
			{options}
			placeholder="Search S-IEDs"
			class="w-full"
			{disabled}
		/>
	</div>
</section>
