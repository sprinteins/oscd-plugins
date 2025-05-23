<script lang="ts">
// CORE
import {
	compasStore,
	Button,
	Separator,
	TooltipWorkaround,
	Sidebar
} from '@oscd-plugins/core-ui-svelte'
// STORES
import { importsStore, sidebarStore } from '@/headless/stores'
// COMPONENTS
import { X } from 'lucide-svelte'

//====== INITIALIZATION ======//

// actions
const sidebar = Sidebar.useSidebar()

//====== FUNCTIONS ======//

function handleImportClose() {
	importsStore.removeLoadedElements()
	sidebarStore.resetCurrentElementType()
	sidebar.setOpen(false)
}
</script>

<aside class="flex items-center justify-end space-x-5 px-4 pt-4 h-fit">

<span class="uppercase font-black mr-2 text-xs">Import menu</span>

<Separator.Root orientation="vertical"/>

{#if importsStore.currentFilename}
	
	<div class="flex items-center space-x-5 h-full">
		<span class="-mr-[0.75rem]">Current selected file for import:</span>
		<span class="font-black">
			{importsStore.currentFilename}
		</span>

		<Separator.Root orientation="vertical"/>

		<TooltipWorkaround position="left" text="Close current import" class="!flex items-center">
			<Button.Root 
				onclick={handleImportClose}
				variant="ghost"
				class="rounded-full p-0 size-7 self-center"
			>
				<X class="!size-5" />
			</Button.Root>
		</TooltipWorkaround>
	</div>
{:else}

	{#await compasStore.isCompasEnabled then isEnabled}
		{#if isEnabled}
			<Button.Root 
				onclick={() => importsStore.loadFromCompas()}
				variant="ghost"
				class=""
			>
				Load from Compas
			</Button.Root>

		<Separator.Root orientation="vertical"/>
		{/if}

		<Button.Root 
			onclick={() => importsStore.fileInput?.click()}
			variant="ghost"
			class="-ml-4"
		>
			Load from local
		</Button.Root>
	{/await}

{/if}

<input type="file" bind:this={importsStore.fileInput} onchange={() => importsStore.loadFromLocal()} class="hidden" />

</aside>