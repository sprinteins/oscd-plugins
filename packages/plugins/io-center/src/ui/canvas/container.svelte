<script lang="ts">
import { Card } from '@oscd-plugins/core-ui-svelte'
const { title, children } = $props()
</script>

<Card.Root class="flex-1 flex flex-col min-h-full bg-card/50">
	<Card.Header class="pb-4">
			<Card.Title>{ title }</Card.Title>
	</Card.Header>

	<Card.Content class="px-4 pt-4 overflow-y-hidden h-full space-y-5">
		{@render children()}
	</Card.Content>
</Card.Root>
