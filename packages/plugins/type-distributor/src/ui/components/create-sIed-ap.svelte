<script lang="ts">
import { createSIED } from '@/headless/ied'
import { Label, Input, Button } from '@oscd-plugins/core-ui-svelte'

let iedName = $state('')
let iedDesc = $state('')
let isCreatingIED = $state(false)
let iedCreationError = $state<string | null>(null)
let isFormOpen = $state(false)
let formContainer: HTMLDivElement | undefined = $state()

function handleCreateIED() {
	// Reset error
	iedCreationError = null

	// Validate name
	if (!iedName.trim()) {
		iedCreationError = 'IED name is required'
		return
	}

	try {
		isCreatingIED = true
		createSIED(iedName.trim(), iedDesc.trim() || undefined)

		// Reset form on success
		iedName = ''
		iedDesc = ''
		isFormOpen = false // Close form on success
	} catch (error) {
		iedCreationError =
			error instanceof Error ? error.message : 'Failed to create IED'
	} finally {
		isCreatingIED = false
	}
}

function handleClickOutside(event: MouseEvent) {
	if (formContainer && !formContainer.contains(event.target as Node)) {
		isFormOpen = false
		iedCreationError = null
	}
}

$effect(() => {
	if (isFormOpen) {
		document.addEventListener('click', handleClickOutside)
		return () => {
			document.removeEventListener('click', handleClickOutside)
		}
	}
})
</script>

<div class="relative mb-10" >
	{#if !isFormOpen}
		<Button.Root
      class="w-full"
			onclick={(e) => {
				e.stopPropagation()
				isFormOpen = true
			}}
		>
			Add
		</Button.Root>
	{/if}

	{#if isFormOpen}
		<div
			bind:this={formContainer}
			class="space-y-3 p-4 border rounded-md shadow-lg bg-white"
			onclick={(e) => e.stopPropagation()}
			onkeydown={(e) => e.stopPropagation()}
			role="dialog"
			tabindex="-1"
		>
			<div class="space-y-2">
				<Label.Root for="ied-name">Name *</Label.Root>
				<Input.Root
					id="ied-name"
					bind:value={iedName}
					placeholder="Enter IED name"
					disabled={isCreatingIED}
				/>
			</div>
			<div class="space-y-2">
				<Label.Root for="ied-desc">Description</Label.Root>
				<Input.Root
					id="ied-desc"
					bind:value={iedDesc}
					placeholder="Enter IED description (optional)"
					disabled={isCreatingIED}
				/>
			</div>
			{#if iedCreationError}
				<p class="text-sm text-red-600">{iedCreationError}</p>
			{/if}
			<Button.Root
				onclick={handleCreateIED}
				disabled={isCreatingIED || !iedName.trim()}
				class="w-full"
			>
				{isCreatingIED ? "Creating..." : "Create IED"}
			</Button.Root>
		</div>
	{/if}
</div>
