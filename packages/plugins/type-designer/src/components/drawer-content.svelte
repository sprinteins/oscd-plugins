<script lang="ts">
// CONSTANTS
import { SCD_ELEMENTS } from '@oscd-plugins/core'
// SMUI COMPONENTS
import Textfield from '@smui/textfield'
import Button from '@smui/button'
// STORES
import { pluginStore } from '@/stores/plugin.store'
import { drawerStore } from '@oscd-plugins/ui'
// TYPES
import type { DataTypeTemplates } from '@oscd-plugins/core'

//====== INITIALIZATION ====//

// props
export let typeElement: DataTypeTemplates.TypeElement
export let currentColumn: keyof typeof SCD_ELEMENTS

let localAttributes: Partial<
	Record<(typeof standardAttributes)[number], string>
>

//====== REACTIVITY ====//
$: ({ element, ...attributes } = typeElement)
$: standardAttributes = SCD_ELEMENTS[currentColumn]?.element.standardAttributes
$: setNewLocalAttributes(attributes)

//====== FUNCTIONS =====//

function updateTypeElement() {
	pluginStore.createAndDispatchUpdateActionEvent({
		element,
		oldAttributes: attributes,
		newAttributes: localAttributes
	})
	drawerStore.handleCloseDrawer()
}

/**
 * Set the new local attributes
 * This is necessary to avoid reactivity issues
 * because of the nature of the dynamic component & props
 * @param newAttributes
 */
function setNewLocalAttributes(
	newAttributes: Partial<Record<(typeof standardAttributes)[number], string>>
) {
	localAttributes = newAttributes
}
</script>

<div id="type-designer-drawer">
	<div class="form">
		{#each standardAttributes as attribute}
			{#if attribute !== 'id' && localAttributes[attribute] !== undefined}
				<Textfield class="textField" variant="outlined" bind:value={localAttributes[attribute]} label={attribute} />
			{/if}
		{/each}
	</div>
	<div class="action">
		<Button on:click={drawerStore.handleCloseDrawer}>Cancel</Button>
		<Button on:click={updateTypeElement}>Save</Button>
		
	</div>
</div>

<style>
#type-designer-drawer {
	display: flex;
	flex-direction: column;
	padding: 1rem;
	position: relative;
	height: 100%;
}

.form {
	flex: 1;
	overflow-y: auto;	
}

#type-designer-drawer :global(.textField) {
	width: 100%;
	margin: 1rem 0;
}

.action {
	display: flex;
	justify-content: space-between;
	padding: .5rem 0;
	background-color: var(--mdc-theme-surface);
	width: 100%;
	margin-bottom: 1rem;
}
</style>