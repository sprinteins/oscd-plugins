	
<script lang="ts">
// COMPONENTS
import {
	Sidebar,
	Input,
	Label,
	pluginGlobalStore
} from '@oscd-plugins/core-ui-svelte'
// SPECIAL ATTRIBUTES
import VirtualAttribute from '@/ui/components/sidebar/special-attributes/virtual-attribute.svelte'
// CHILDREN OPTIONS
import ConductingEquipmentChildrenOptions from '@/ui/components/sidebar/children-options/conducting-equipment.svelte'
// CONSTANTS
import { TYPE_FAMILY, READONLY_ATTRIBUTES } from '@/headless/constants'
// STORES
import { sidebarStore, pluginLocalStore } from '@/headless/stores'

//====== CONSTANTS ======//

const attributesNeedingOneLineLayout = ['virtual']

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

function onChangeHandler(attributeKey: string) {
	if (
		sidebarStore.currentElementType &&
		sidebarStore.isInputValidByAttributeKey?.[attributeKey]
	)
		pluginGlobalStore.updateElement({
			element: sidebarStore.currentElementType.element,
			attributes: sidebarStore.currentElementType.attributes
		})
}

function isCurrentInputDisabled(attributeKey: string) {
	return (
		isAttributeReadonly(attributeKey) ||
		sidebarStore.isCurrentElementImported
	)
}

function isAttributeReadonly(attributeKey: string) {
	return READONLY_ATTRIBUTES.some((attributes) => attributes === attributeKey)
}
</script>

<Sidebar.Root side="right" class="sidebar-root z-0" >
	{#if sidebarStore.currentElementType}

		<Sidebar.Header class="text-xl font-black">Edit {sidebarStore.currentElementType.attributes?.name || sidebarStore.currentElementType.attributes?.id}</Sidebar.Header>
		<Sidebar.Content class="p-4 space-y-5">
			<div class="space-y-3">
				<Label.Root class="text-lg font-bold">Attributes details:</Label.Root>
				{#each currentElementAttributesEntries as [attributeKey, attributeProperties]}
					<div class={`flex justify-center ${attributesNeedingOneLineLayout.includes(attributeKey) ? "justify-between items-center" : "flex-col"}`}>
						<Label.Root for={attributeKey} class="capitalize">{attributeKey}</Label.Root>
						{#if sidebarStore.currentElementTypeFamily === 'lNodeType'}
							<Input.Root 
								disabled
								class="mt-2"
								bind:value={sidebarStore.currentElementType.attributes[attributeKey]}
							/>
						{:else if sidebarStore.currentElementTypeKey && sidebarStore.currentElementTypeFamily && sidebarStore.isInputValidByAttributeKey}
							{#if attributeKey === 'virtual'}
								<VirtualAttribute onChangeHandler={onChangeHandler} />
							{:else}
								<Input.Root 
									disabled={isCurrentInputDisabled(attributeKey)}
									class={`mt-1 ${!isCurrentInputDisabled(attributeKey) && !sidebarStore.isInputValidByAttributeKey[attributeKey] ? 'border-destructive focus-visible:ring-destructive' : ''}`}
									required={attributeProperties.required}
									type="text"
									id={attributeKey}
									placeholder={isAttributeReadonly(attributeKey) ? '' : attributeKey}
									bind:value={sidebarStore.currentElementType.attributes[attributeKey]}
									onchange={() => onChangeHandler(attributeKey)}
								/>
								{#if !isCurrentInputDisabled(attributeKey) && !sidebarStore.isInputValidByAttributeKey[attributeKey]}
									<p class="text-destructive text-xs mt-1">This value should be unique</p>
								{/if}
							{/if}
						{/if}
					</div>
				{/each}
			</div>
			
			{#if Object.values(sidebarStore.currentElementType?.parameters.childrenOptions).length}
				<div class="space-y-3">
					<Label.Root class="text-lg font-bold">Child Elements Options:</Label.Root>
					<ConductingEquipmentChildrenOptions />
				</div>
			{/if}
		</Sidebar.Content>
		<Sidebar.Footer />

	{/if}
</Sidebar.Root>


