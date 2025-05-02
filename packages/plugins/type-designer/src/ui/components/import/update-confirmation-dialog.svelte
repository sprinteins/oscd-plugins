<script lang="ts">
// CORE
import { dialogStore, Button } from '@oscd-plugins/core-ui-svelte'
// STORES
import { importsStore } from '@/headless/stores'
// TYPES
import type { UserDecision } from '@/headless/stores'

//====== FUNCTIONS ======//

async function handleResponse(returnValue: UserDecision) {
	await dialogStore.closeDialog(returnValue)
}

const elementsToCreate = $derived(
	importsStore.currentImportedElementGroupedByActions.create
)
const elementsToReplace = $derived(
	importsStore.currentImportedElementGroupedByActions.replace
)
</script>

<section >
	<header class="pb-4">
		<h1 class="text-xl font-bold">Import details</h1>
	</header>
	<div class="overflow-y-auto h-[50vh]">
		{#if elementsToReplace.length}
			<p class="mb-1">The following elements will be <span class="font-black">replaced</span>:</p>
			<ul class="list-disc ml-5">
				{#each elementsToReplace as element}
					<li>{element}</li>
				{/each}
			</ul>
		{/if}

		{#if elementsToCreate.length}
			<p class={`${elementsToReplace.length ? "mt-5" : ""} mb-1`}>The following elements will be <span class="font-black">created</span>:</p>
			<ul class="list-disc ml-5">
				{#each elementsToCreate as element}
					<li>{element}</li>
				{/each}
			</ul>
		{/if}
	</div>
	<footer class="flex justify-end space-x-2 mt-4">
		<Button.Root variant="outline" class="hover:bg-destructive hover:text-destructive-foreground" onclick={async () => handleResponse('cancel')}>Cancel</Button.Root>
		<!-- {#if elementsToReplace.length}
			<Button.Root variant="outline" class="hover:bg-secondary hover:text-secondary-foreground" onclick={async () => handleResponse('forceCreate')}>Force creation only</Button.Root>
		{/if} -->
		<Button.Root onclick={async () => handleResponse('proceed')}>Proceed</Button.Root>
	</footer>
</section>