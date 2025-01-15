	
<script lang="ts">
// CORE
import { DEFINITION } from '@oscd-plugins/core-standard/ed2'
// COMPONENTS
import {
	Sidebar,
	Input,
	Label,
	xmlDocumentStore
} from '@oscd-plugins/core-ui-svelte'
// STORES
import { sidebarStore } from '@/headless/stores/sidebar.svelte'
import { elementTypesStore } from '@/headless/stores/element-types.svelte'

//====== INITIALIZATION ======//

// props

//====== REACTIVE VARIABLES ======//
const currentElementAttributesEntries = $derived(
	Object.entries(DEFINITION[sidebarStore.currentElementTypeFamily].attributes)
)

const isAnyAttributeAllowed = $derived(
	DEFINITION[sidebarStore.currentElementTypeFamily].anyAllowed.attributes
)

//====== FUNCTIONS ======//
</script>

<Sidebar.Root side="right" class="sidebar-root ">
	{#if sidebarStore.currentElementType}

			<Sidebar.Header>Edit {sidebarStore.currentElementType.name}</Sidebar.Header>
			<Sidebar.Content class="p-4 space-y-5">
				{#each currentElementAttributesEntries as [attributeKey, attributeProperties]}
					<div>
						<Label.Root for={attributeKey} class="capitalize mb-4">{attributeKey}</Label.Root>
						{#if sidebarStore.currentElementTypeFamily === 'lNodeType'}
							<Input.Root 
								disabled
								bind:value={sidebarStore.currentElementType.attributes[attributeKey]}
							/>
							{:else if sidebarStore.currentElementTypeKey}
							<Input.Root 
								required={attributeProperties.required} type="text" id={attributeKey}
								placeholder={attributeKey}
								bind:value={sidebarStore.currentElementType.attributes[attributeKey]}
								oninput={() => elementTypesStore.updateElementType(attributeKey)}
							/>
						{/if}
					</div>
				{/each}
				{#if isAnyAttributeAllowed}
					<span>Any attribute allowed</span>
				{/if}
			</Sidebar.Content>
			<Sidebar.Footer />

	{/if}
</Sidebar.Root>


