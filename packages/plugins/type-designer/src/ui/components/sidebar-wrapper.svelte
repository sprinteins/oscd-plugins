	
<script lang="ts">
// COMPONENTS
import {
	Sidebar,
	Input,
	Label,
	pluginGlobalStore,
	Switch
} from '@oscd-plugins/core-ui-svelte'
// CONSTANTS
import { TYPE_FAMILY, READONLY_ATTRIBUTES } from '@/headless/constants'
// STORES
import { sidebarStore, pluginLocalStore } from '@/headless/stores'

//====== REACTIVE VARIABLES ======//

const currentElementAttributesEntries = $derived.by(() => {
	if (!sidebarStore.currentElementTypeFamily) return []
	const currentTypeFamily = TYPE_FAMILY[sidebarStore.currentElementTypeFamily]

	return Object.entries(
		pluginLocalStore.currentDefinition[currentTypeFamily].attributes || {}
	)
})

const isAnyAttributeAllowed = $derived.by(() => {
	if (!sidebarStore.currentElementTypeFamily) return false

	const currentTypeFamily = TYPE_FAMILY[sidebarStore.currentElementTypeFamily]
	return pluginLocalStore.currentDefinition?.[currentTypeFamily].anyAllowed
		.attributes
})

//====== FUNCTIONS ======//

function isAttributeReadonly(attributeKey: string) {
	return READONLY_ATTRIBUTES.some((attributes) => attributes === attributeKey)
}

function onChangeHandler() {
	sidebarStore.currentElementType &&
		pluginGlobalStore.updateElement({
			element: sidebarStore.currentElementType.element,
			attributes: sidebarStore.currentElementType.attributes
		})
}

function getVirtualValue() {
	return sidebarStore.currentElementType?.attributes.virtual === 'true'
}

function setVirtualValue(value: boolean) {
	if (sidebarStore.currentElementType)
		sidebarStore.currentElementType.attributes.virtual = value
			? 'true'
			: 'false'
	onChangeHandler()
}

const attributesNeedingOneLineLayout = ['virtual']
</script>

<Sidebar.Root side="right" class="sidebar-root z-0">
	{#if sidebarStore.currentElementType}

			<Sidebar.Header>Edit {sidebarStore.currentElementType.attributes?.name}</Sidebar.Header>
			<Sidebar.Content class="p-4 space-y-5">
				{#each currentElementAttributesEntries as [attributeKey, attributeProperties]}
					<div class={`flex justify-center ${attributesNeedingOneLineLayout.includes(attributeKey) ? "justify-between items-center" : "flex-col"}`}>
						<Label.Root for={attributeKey} class="capitalize">{attributeKey}</Label.Root>
						{#if sidebarStore.currentElementTypeFamily === 'lNodeType'}
							<Input.Root 
								disabled
								class="mt-2"
								bind:value={sidebarStore.currentElementType.attributes[attributeKey]}
							/>
						{:else if sidebarStore.currentElementTypeKey && sidebarStore.currentElementTypeFamily}
							{#if attributeKey === 'virtual'}
								<Switch.Root
									class="mt-1 self-end"
									bind:checked={
										getVirtualValue,
										setVirtualValue
									}
									oninput={onChangeHandler}
								/>
							{:else}
								<Input.Root 
									disabled={isAttributeReadonly(attributeKey)}
									class="mt-1"
									required={attributeProperties.required}
									type="text"
									id={attributeKey}
									placeholder={isAttributeReadonly(attributeKey) ? '' : attributeKey}
									bind:value={sidebarStore.currentElementType.attributes[attributeKey]}
									onchange={onChangeHandler}
								/>
							{/if}
						{/if}
					</div>
				{/each}
			</Sidebar.Content>
			<Sidebar.Footer />

	{/if}
</Sidebar.Root>


