	
<script lang="ts">
// CORE
import { DEFINITION } from '@oscd-plugins/core-standard/ed2'
// COMPONENTS
import { Sidebar, Input, Label } from '@oscd-plugins/core-ui-svelte'
// STORES
import { sidebarStore } from '@/headless/stores/sidebar.svelte'

//====== INITIALIZATION ======//

// props

//====== REACTIVE VARIABLES ======//
const currentElementAttributesEntries = $derived(
	Object.entries(DEFINITION[sidebarStore.currentElementTypeFamily].attributes)
)

const isAnyAttributeAllowed = $derived(
	DEFINITION[sidebarStore.currentElementTypeFamily].anyAllowed.attributes
)
</script>

<Sidebar.Root side="right" class={import.meta.env.DEV ? '': 'h-[--global-height] top-auto'}>
	{#if sidebarStore.currentElementType}

			<Sidebar.Header>Edit {sidebarStore.currentElementType.name}</Sidebar.Header>
			<Sidebar.Content class="p-4 space-y-5">
				{#each currentElementAttributesEntries as [attributeKey, attributeProperties]}
					<div>
						<Label.Root for={attributeKey} class="capitalize">{attributeKey}</Label.Root>
						<Input.Root disabled={sidebarStore.currentElementType.family === 'lNodeType'} required={attributeProperties.required} type="text" id={attributeKey} placeholder={attributeKey} bind:value={sidebarStore.currentElementType.attributes[attributeKey]}/>
					</div>
				{/each}
				{#if isAnyAttributeAllowed}
					<span>default allowed</span>
				{/if}
			</Sidebar.Content>
			<Sidebar.Footer />

	{/if}
</Sidebar.Root>


