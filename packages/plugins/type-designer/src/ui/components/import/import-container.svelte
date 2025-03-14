<script lang="ts">
// CORE
import { Button, Card, TooltipWorkaround } from '@oscd-plugins/core-ui-svelte'
// COMPONENTS
import CardCollapsibleWrapper from '../element-card/card-collapsible-wrapper.svelte'
import { X } from 'lucide-svelte'
// CONSTANTS
import { COLUMN_KEY_TO_TYPE_FAMILY } from '@/headless/constants'
// STORES
import { importsStore } from '@/headless/stores'
// TYPES
import type {
	AvailableImportedTypeFamily,
	SortedImportedTypeElements,
	Columns
} from '@/headless/stores'

//======= INITIALIZATION =======//

// props
const {
	columnKey,
	groupedImportedTypeElementsEntries
}: {
	columnKey: Extract<keyof Columns, 'functionType' | 'lNodeType'>
	groupedImportedTypeElementsEntries: [
		AvailableImportedTypeFamily,
		SortedImportedTypeElements<AvailableImportedTypeFamily>
	][]
} = $props()

const hasAvailableImportedTypeElements = $derived.by(() => {
	return groupedImportedTypeElementsEntries?.some(
		([, importedTypeElements]) =>
			importedTypeElements.available &&
			Object.keys(importedTypeElements.available)?.length
	)
})

//======= FUNCTIONS =======//

function fireLoader() {
	if (importsStore.lastImportSource === 'compas')
		importsStore.loadFromCompas(columnKey)
	if (importsStore.lastImportSource === 'local')
		importsStore.fileInput[columnKey]?.click()
}

async function handleImportAll() {
	const currentTypeFamily = COLUMN_KEY_TO_TYPE_FAMILY[columnKey]
	await importsStore.addAllImportedElements(currentTypeFamily)
}
</script>
	

	<Card.Root class="flex-1 flex flex-col p-2 -m-2 bg-background/50 rounded-none overflow-hidden h-full">
		<Card.Header class="p-0 flex flex-row justify-between items-center mb-2 space-y-0">
			<span class="px-2 truncate font-black">{importsStore.currentFilenameByColumnKey[columnKey]}</span>
			<TooltipWorkaround position="left" text="Close">
				<Button.Root variant="ghost" class="rounded-full p-0 size-7" onclick={() => importsStore.removeImportedElements(columnKey)}>
					<X class="!size-5"/>
				</Button.Root>
			</TooltipWorkaround>
		</Card.Header>
			<Card.Content class="overflow-y-auto p-2">
				{#if hasAvailableImportedTypeElements}
					{#each groupedImportedTypeElementsEntries as [typeElementFamily, typeElements]}
						{#each Object.entries(typeElements.available) as [typeElementKey, typeElement]}
							<CardCollapsibleWrapper {typeElementKey} {typeElement} {typeElementFamily} isImportContainer={true}/>
						{/each}
					{/each}
				{:else}
					<p class="text-muted-foreground/75">Seems like there is no updated or new elements in the file you selected.</p>
				{/if}
		</Card.Content>
		<Card.Footer class="mt-auto p-0 pt-2">
			{#if hasAvailableImportedTypeElements}
				<Button.Root variant="secondary" size="sm" class="!my-0 w-full" onclick={handleImportAll}>Import all</Button.Root>
			{:else}
				<Button.Root variant="ghost" size="sm" class="text-primary !my-0 w-full" onclick={fireLoader}>Select new file</Button.Root>
			{/if}
		</Card.Footer>
		
	</Card.Root>
