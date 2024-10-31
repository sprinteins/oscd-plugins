<script lang="ts">
// CONSTANTS
import { SCD_ELEMENTS } from '@oscd-plugins/core'
// SMUI COMPONENTS
import Card from '@smui/card'
// COMPONENTS
import DrawerContent from './drawer-content.svelte'
// STORES
import { drawerStore } from '@oscd-plugins/ui'
// TYPES
import type { DataTypeTemplates } from '@oscd-plugins/core'

//====== INITIALIZATION ======//

// props
export let name: string
export let typeElement: DataTypeTemplates.TypeElement
export let currentColumn: keyof typeof SCD_ELEMENTS

// store
const { drawer } = drawerStore

//====== FUNCTIONS ======//

function handleCardClick() {
	const payload = {
		title: 'Edit type',
		description: `#${typeElement.id}`,
		component: DrawerContent,
		componentProps: {
			typeElement,
			currentColumn
		}
	}

	if (
		$drawer.componentProps?.typeElement.id &&
		$drawer.componentProps?.typeElement.id !== typeElement.id
	)
		return drawerStore.handleOpenDrawer(payload)

	return drawerStore.handleSwitchDrawer(payload)
}
</script>

<section id="type-designer-card">
    <Card class="card" on:click={() => handleCardClick()}>
        {name}
        <div class="rhombus-icon"></div>
    </Card>
</section>

<style>
    #type-designer-card :global(.card) {
        padding: 1rem;
        border-radius: 4px;
        margin-bottom: 1rem;
        flex-shrink: 0;
        border: 1px solid #ccc;
        cursor: pointer;
    }
		
		.rhombus-icon {
    position: absolute;
    top: 0.5rem;
    right: 0.5rem;
    width: 8px;
    height: 8px;
    background-color: rgb(81, 159, 152);
    transform: rotate(45deg);
  }
</style>
