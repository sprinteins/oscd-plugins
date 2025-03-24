<script lang="ts">
// SVELTE
import { fly } from 'svelte/transition'
import { cubicOut } from 'svelte/easing'
// CORE
import {
	dialogStore,
	compasStore,
	Button,
	Separator
} from '@oscd-plugins/core-ui-svelte'
// STORES
import { importsStore } from '@/headless/stores'
// COMPONENTS
import { MoveLeft, LoaderCircle, Folder, File, FolderOpen } from 'lucide-svelte'
// TYPES
import type { Compas } from '@oscd-plugins/core-ui-svelte'

//====== INITIALIZATION ======//

// states
let selectedType = $state<Compas.AvailableFileType>()
let selectedFilename = $state<string>()
let selectedFileId = $state<string>()

// derived
const fileTypes = $derived(compasStore.getFileTypes())
const filesList = $derived(
	selectedType && compasStore.getFilesByType(selectedType)
)

//====== FUNCTIONS ======//

function resetSelectInputs() {
	selectedType = undefined
	selectedFileId = undefined
	selectedFilename = undefined
}

async function loadSelectedFile() {
	if (selectedType && selectedFileId) {
		const loadedFile = await compasStore.getFileByTypeAndId(
			selectedType,
			selectedFileId
		)
		importsStore.importedXmlDocument = loadedFile
		if (importsStore.currentImportColumnKey && selectedFilename)
			importsStore.currentFilenameByColumnKey[
				importsStore.currentImportColumnKey
			] = selectedFilename
		importsStore.loadElements()
		dialogStore.closeDialog()
		resetSelectInputs()
	}
}

function handleFileSelection(selectedFile: Compas.FileByType) {
	selectedFileId = selectedFile.id
	selectedFilename = selectedFile.name
}
//====== EFFECTS ======//

$effect(() => {
	if (!dialogStore.isOpen) selectedType = undefined
})
</script>

<section>
	<header class="space-y-2 mb-5">
		<h1 class="text-xl font-bold">Select a file</h1>
		<p class="text-sm text-muted-foreground">After selecting a file you can import your needed Functions or LNodeTypes in the specific columns.</p>
	</header>

	<Separator.Root class="mb-5" />

	<div class="overflow-x-hidden overflow-y-auto h-[50vh]">
		{#if !selectedType}
		  <!-- TYPE SELECTION START -->
			<div
				in:fly={{ x: "-100%", opacity: 1, easing: cubicOut, duration: 500 }}
				out:fly={{ x: "-100%", opacity: 1, easing: cubicOut, duration: 100 }}
				class="flex flex-col space-y-2"
			>
				{#await fileTypes}

				<LoaderCircle class="animate-spin self-center"/>

				{:then currentFileTypes}

					{#if currentFileTypes?.length}

							{#each currentFileTypes as fileType}
								<Button.Root class="w-full group flex justify-start" variant="ghost" onclick={() => { selectedType = fileType.code }}>
									<Folder class="group-hover:hidden block"/>
									<FolderOpen class="group-hover:block hidden"/>
									<span>{fileType.description} ({fileType.code})</span>
								</Button.Root>
							{/each}
	
					{/if}

				{/await}
			</div>
			<!-- TYPE SELECTION END -->
		{:else}
			<!-- FILE SELECTION START -->
			<div
				in:fly={{ x: "100%", opacity: 1, easing: cubicOut, duration: 500 }}
				out:fly={{ x: "100%", opacity: 1, easing: cubicOut, duration: 100 }}
				class="flex flex-col space-y-2"
			>
				<Button.Root class={`"group flex justify-start items-center" ${selectedType ? "visible": "invisible"}`} variant="link" onclick={resetSelectInputs}>
					<MoveLeft class="!size-5" /><span>Return to select a file type</span>
				</Button.Root>
				{#await filesList}

				<LoaderCircle class="animate-spin self-center"/>

				{:then currentFilesList}
					{#if currentFilesList?.length}
						{#each currentFilesList as file}
							<Button.Root class="w-full group flex items-center justify-between" variant={selectedFileId === file.id ? 'secondary' : 'ghost'} onclick={() => handleFileSelection(file)}>
								<div class="flex items-center space-x-2 min-w-0">
									<File/> 
									<span class="truncate ">{file.name}</span>
								</div>
									{#if file.label}<span>{file.label}</span>{/if}
									<span>({file.version})</span>
							</Button.Root>
						{/each}
					{:else}
						<p class="text-muted-foreground self-center">No files available</p>
					{/if}

				{/await}
			</div>
			<!-- FILE SELECTION END -->
		{/if}
	</div>

	<footer class="flex justify-end space-x-2 mt-5">
		<Button.Root variant="outline" class="hover:bg-secondary hover:text-secondary-foreground" onclick={() => { dialogStore.closeDialog(); resetSelectInputs();}}>Cancel</Button.Root>
		<Button.Root disabled={!selectedFileId} onclick={loadSelectedFile}>Select</Button.Root>
	</footer>
</section>