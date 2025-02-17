	
<script lang="ts">
// COMPONENTS
import {
	Sidebar,
	Input,
	Label,
	pluginGlobalStore
} from '@oscd-plugins/core-ui-svelte'
// CONSTANTS
import {
	READONLY_ATTRIBUTES,
	TYPE_FAMILY_EQUIVALENT_FOR_ATTRIBUTES
} from '@/headless/constants'
// STORES
import {
	sidebarStore,
	typeElementsStore,
	pluginLocalStore
} from '@/headless/stores'

//====== REACTIVE VARIABLES ======//

const currentElementAttributesEntries = $derived.by(() => {
	if (!sidebarStore.currentElementTypeFamily) return []
	const currentTypeFamily =
		TYPE_FAMILY_EQUIVALENT_FOR_ATTRIBUTES[
			sidebarStore.currentElementTypeFamily
		]

	return Object.entries(
		pluginLocalStore.currentDefinition[currentTypeFamily].attributes || {}
	)
})

const isAnyAttributeAllowed = $derived.by(() => {
	if (!sidebarStore.currentElementTypeFamily) return false

	const currentTypeFamily =
		TYPE_FAMILY_EQUIVALENT_FOR_ATTRIBUTES[
			sidebarStore.currentElementTypeFamily
		]
	return pluginLocalStore.currentDefinition?.[currentTypeFamily].anyAllowed
		.attributes
})

//====== FUNCTIONS ======//

function isAttributeReadonly(attributeKey: string) {
	return READONLY_ATTRIBUTES.some((attributes) => attributes === attributeKey)
}
</script>

<Sidebar.Root side="right" class="sidebar-root ">
	{#if sidebarStore.currentElementType}

			<Sidebar.Header>Edit {sidebarStore.currentElementType.attributes?.name}</Sidebar.Header>
			<Sidebar.Content class="p-4 space-y-5">
				{#each currentElementAttributesEntries as [attributeKey, attributeProperties]}
					<div>
						<Label.Root for={attributeKey} class="capitalize">{attributeKey}</Label.Root>
						{#if sidebarStore.currentElementTypeFamily === 'lNodeType'}
							<Input.Root 
								disabled
								class="mt-2"
								bind:value={sidebarStore.currentElementType.attributes[attributeKey]}
							/>
						{:else if sidebarStore.currentElementTypeKey && sidebarStore.currentElementTypeFamily}
							<Input.Root 
								disabled={isAttributeReadonly(attributeKey)}
								class="mt-1"
								required={attributeProperties.required}
								type="text"
								id={attributeKey}
								placeholder={isAttributeReadonly(attributeKey) ? '' : attributeKey}
								bind:value={sidebarStore.currentElementType.attributes[attributeKey]}
								oninput={() => sidebarStore.currentElementType && pluginGlobalStore.updateElement({ element: sidebarStore.currentElementType.element, attributes: sidebarStore.currentElementType.attributes })}
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


