<script lang="ts">
// CORE
import {
	Button,
	Card,
	Tabs,
	TooltipWorkaround
} from '@oscd-plugins/core-ui-svelte'
// COMPONENTS
import CardCollapsibleWrapper from '../element-card/card-collapsible-wrapper.svelte'
// CONSTANTS
import { COLUMN_KEY_TO_TYPE_FAMILY } from '@/headless/constants'
// STORES
import { importsStore, dndStore } from '@/headless/stores'
// TYPES
import type {
	AvailableTypeFamily,
	SortedImportedTypeElements,
	Columns,
	ImportScope
} from '@/headless/stores'

//======= INITIALIZATION =======//

// props
const {
	columnKey,
	groupedLoadedTypeElementsEntries
}: {
	columnKey: keyof Columns
	groupedLoadedTypeElementsEntries: [
		AvailableTypeFamily,
		SortedImportedTypeElements<AvailableTypeFamily>
	][]
} = $props()

//======= DERIVED STATES ======//

const hasLoadedTypeElementsPerScope = $derived({
	all: hasLoadedTypeElements('all'),
	toAdd: hasLoadedTypeElements('toAdd'),
	toUpdate: hasLoadedTypeElements('toUpdate')
})

//======= FUNCTIONS =======//

function fireLoader() {
	if (importsStore.lastImportSource === 'compas')
		importsStore.loadFromCompas()
	if (importsStore.lastImportSource === 'local')
		importsStore.fileInput?.click()
}

async function handleImportAll(scope: 'all' | ImportScope) {
	const currentTypeFamily: AvailableTypeFamily[] = Array.isArray(
		COLUMN_KEY_TO_TYPE_FAMILY[columnKey]
	)
		? COLUMN_KEY_TO_TYPE_FAMILY[columnKey]
		: ([COLUMN_KEY_TO_TYPE_FAMILY[columnKey]] as AvailableTypeFamily[])

	await importsStore.handleAllImportsAndFireDialogDecision(
		currentTypeFamily,
		scope
	)
}

function getButtonGlobalImportLabel(scope: 'all' | ImportScope) {
	if (scope === 'all') return 'Import and update all'
	if (scope === 'toAdd') return 'Import all'
	if (scope === 'toUpdate') return 'Update all'
}

function getEmptyContainerText(scope: 'all' | ImportScope) {
	if (scope === 'all') return 'to add or to update'
	if (scope === 'toAdd') return 'to add'
	if (scope === 'toUpdate') return 'to update'
}

function hasLoadedTypeElements(scope: 'all' | ImportScope) {
	return (
		groupedLoadedTypeElementsEntries?.some(
			([, loadedTypeElements]) =>
				Object.keys(loadedTypeElements[scope])?.length
		) || false
	)
}
</script>
	
<Card.Root class={`p-2 -m-2 bg-background/50 rounded-none h-full ${dndStore.isDragging ? 'opacity-25' : ''}`} >
	<Tabs.Root value="all" class="w-full h-full overflow-hidden flex flex-col">
		<Tabs.List class="grid w-full grid-cols-3 shrink-0">
			<Tabs.Trigger value="all">All</Tabs.Trigger>
			<Tabs.Trigger value="add">Add</Tabs.Trigger>
			<Tabs.Trigger value="update" >
				<span class="relative">
					Update
					{#if hasLoadedTypeElementsPerScope.toUpdate}
						<div class="absolute -top-1 -right-3">
							<TooltipWorkaround text="Update available" position="left" variant="accent" class="z-10">
								<span class="relative flex size-2">
									<span class="absolute inline-flex h-full w-full animate-ping rounded-full bg-primary opacity-75"></span>
									<span class="relative inline-flex size-2 rounded-full bg-primary"></span>
								</span>
							</TooltipWorkaround>
						</div>
					{/if}
				</span>
			</Tabs.Trigger>
		</Tabs.List>
		<Tabs.Content value="all" class="flex-1 overflow-hidden">
			{@render importOptions('all')}
		</Tabs.Content>
		<Tabs.Content value="add" class="flex-1 overflow-hidden">
			{@render importOptions('toAdd')}
		</Tabs.Content>
		<Tabs.Content value="update" class="flex-1 overflow-hidden">
			{@render importOptions('toUpdate')}
		</Tabs.Content>
	</Tabs.Root>
</Card.Root>

{#snippet importOptions(scope: 'all' | ImportScope)}
<div class="flex flex-col h-full">
	<Card.Content class="px-1.5 pt-4 overflow-y-auto flex-1 pb-0">
		{#if hasLoadedTypeElementsPerScope[scope] }
			{#each groupedLoadedTypeElementsEntries as [typeElementFamily, typeElements]}
				{#if scope === 'all'}
					{#each Object.entries(typeElements.toAdd) as [typeElementKey, typeElement] (typeElementKey)}
						<CardCollapsibleWrapper {typeElementKey} {typeElement} {typeElementFamily} importScope={'toAdd'} />
					{/each}
					{#each Object.entries(typeElements.toUpdate) as [typeElementKey, typeElement] (typeElementKey)}
						<CardCollapsibleWrapper {typeElementKey} {typeElement} {typeElementFamily} importScope={'toUpdate'} />
					{/each}
				{:else}
					{#each Object.entries(typeElements[scope]) as [typeElementKey, typeElement] (typeElementKey)}
						<CardCollapsibleWrapper {typeElementKey} {typeElement} {typeElementFamily} importScope={scope} />
					{/each}
				{/if}
			{/each}
		{:else}
			<p class="text-muted-foreground/75 h-full flex items-center justify-center px-4">Seems like there is no elements { getEmptyContainerText(scope) } in the file you selected.</p>
		{/if}
	</Card.Content>
	<Card.Footer class="p-0 pt-2 shrink-0">
		{#if hasLoadedTypeElementsPerScope[scope]}
			<Button.Root variant="secondary" size="sm" class="!my-0 w-full" onclick={() => handleImportAll(scope)} >
				{ getButtonGlobalImportLabel(scope) }
			</Button.Root>
		{:else}
			<Button.Root variant="ghost" size="sm" class="text-primary !my-0 w-full" onclick={fireLoader}>
				Select new file
			</Button.Root>
		{/if}
	</Card.Footer>
</div>
{/snippet}