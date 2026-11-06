<script lang="ts">
import { Button, dialogStore } from '@oscd-plugins/core-ui-svelte'

let {
	hostName,
	serverAtNames
}: {
	hostName: string
	serverAtNames: string[]
} = $props()

async function cancel() {
	await dialogStore.closeDialog('cancel')
}

async function confirm() {
	await dialogStore.closeDialog('delete')
}
</script>

<div class="flex flex-col gap-4">
	<h2 class="text-lg font-semibold">Delete host Access Point?</h2>
	<p>
		Deleting host Access Point "{hostName}" also deletes the ServerAt Access
		Points that reference it:
	</p>
	<ul class="list-inside list-disc">
		{#each serverAtNames as serverAtName}
			<li>{serverAtName}</li>
		{/each}
	</ul>
	<div class="flex justify-end gap-2">
		<Button.Root variant="outline" onclick={cancel}>Cancel</Button.Root>
		<Button.Root variant="destructive" onclick={confirm}>
			Delete host and references
		</Button.Root>
	</div>
</div>
