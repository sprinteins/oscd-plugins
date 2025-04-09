<script lang="ts">
// COMPONENTS
import { Input } from '@oscd-plugins/core-ui-svelte'
import { SearchIcon } from 'lucide-svelte'

let {
	searchTerm = $bindable(),
	placeholder
}: { searchTerm: string; placeholder: string } = $props()
</script>

<div class="relative block">
	<span class="absolute inset-y-0 left-0 flex items-center pl-2 text-muted-foreground">
		<SearchIcon class="size-5" />
	</span>
	<span class="sr-only">Search</span>
	<Input.Root
		bind:value={searchTerm}
		{placeholder}
		class="py-2 pr-3 pl-9"
	/>
</div>