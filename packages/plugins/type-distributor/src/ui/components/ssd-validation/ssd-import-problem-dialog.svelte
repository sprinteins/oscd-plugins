<script lang="ts">
import { Button, dialogStore } from '@oscd-plugins/core-ui-svelte'

let {
	title = 'Cannot import SSD',
	description = 'Resolve the following SSD problems before importing the file.',
	messages
}: {
	title?: string
	description?: string
	messages: string[]
} = $props()

async function handleClose() {
	await dialogStore.closeDialog('acknowledged')
}
</script>

<section>
	<header class="pb-4 space-y-2">
		<h1 class="text-xl font-bold">{title}</h1>
		<p class="text-sm text-muted-foreground">
			{description}
		</p>
	</header>
	<ul class="list-disc pl-5 space-y-2 text-sm">
		{#each messages as message}
			<li>{message}</li>
		{/each}
	</ul>
	<footer class="flex justify-end mt-6">
		<Button.Root onclick={handleClose}>Close</Button.Root>
	</footer>
</section>