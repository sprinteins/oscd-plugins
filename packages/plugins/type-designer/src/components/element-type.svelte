<script lang="ts">
// CONSTANTS
import { SCD_ELEMENTS } from '@oscd-plugins/core'
// SMUI COMPONENTS
import Accordion, {
	Panel,
	Header,
	Content as PanelContent
} from '@smui-extra/accordion'
// COMPONENTS
import DrawerContent from './drawer-content.svelte'
import ContentCard from './content-card.svelte'
// STORES
import { drawerStore } from '@oscd-plugins/ui'
import { dataTypeTemplatesStore } from '@/stores/data-type-templates.store'
// TYPES
import type { DataTypeTemplates } from '@oscd-plugins/core'

//====== INITIALIZATION ======//

// props
export let typeElement: DataTypeTemplates.TypeElement
export let columnKey: keyof typeof SCD_ELEMENTS

// store
const { drawer } = drawerStore
const { dataTypeTemplatesSubElements } = dataTypeTemplatesStore

// local
let isCurrentPanelOpen = false

//====== FUNCTIONS ======//

function handleCardClick(
	currentTypeOrRefElement:
		| DataTypeTemplates.TypeElement
		| DataTypeTemplates.TypeRefElement
) {
	const { currentColumnKey, currentTypeElement } = getCurrentTypeElement(
		currentTypeOrRefElement
	)
	console.log(currentColumnKey, currentTypeElement)
	const payload = {
		title: `Edit ${SCD_ELEMENTS[currentColumnKey].element.name} type`,
		description: `#${currentTypeElement.id}`,
		component: DrawerContent,
		componentProps: {
			currentTypeElement,
			currentColumnKey
		}
	}

	if (
		$drawer.componentProps?.currentTypeElement.id &&
		$drawer.componentProps?.currentTypeElement.id !== currentTypeElement.id
	)
		return drawerStore.handleOpenDrawer(payload)

	return drawerStore.handleSwitchDrawer(payload)
}

//====== FUNCTIONS ======//

function isTypeElement(
	typeOrRef: DataTypeTemplates.TypeElement | DataTypeTemplates.TypeRefElement
): typeOrRef is DataTypeTemplates.TypeElement {
	return (typeOrRef as DataTypeTemplates.TypeElement).name !== undefined
}

function getCurrentTypeElement(
	currentTypeOrRefElement:
		| DataTypeTemplates.TypeElement
		| DataTypeTemplates.TypeRefElement
): {
	currentColumnKey: keyof typeof SCD_ELEMENTS
	currentTypeElement: DataTypeTemplates.TypeElement
} {
	if (isTypeElement(currentTypeOrRefElement))
		return {
			currentColumnKey: columnKey,
			currentTypeElement: currentTypeOrRefElement
		}

	const currentTypeRefColumn = SCD_ELEMENTS[columnKey].typeRef.from
	if (!currentTypeRefColumn) throw new Error('TypeRef column not found')

	const typeElementFromRef = $dataTypeTemplatesSubElements[
		`${currentTypeRefColumn}Types`
	].find((subElement) => subElement.id === currentTypeOrRefElement.type)

	if (!typeElementFromRef) throw new Error('Type element not found')
	return {
		currentColumnKey: currentTypeRefColumn,
		currentTypeElement: typeElementFromRef
	}
}

function getTypeOrRefName(
	currentTypeOrRefElement:
		| DataTypeTemplates.TypeElement
		| DataTypeTemplates.TypeRefElement
) {
	const { currentTypeElement } = getCurrentTypeElement(
		currentTypeOrRefElement
	)

	return currentTypeElement.name || currentTypeElement.id
}
</script>

<section id="type-designer-card">
	<Accordion  class="accordion">
		{#if typeElement.typeRefs?.length}
			<Panel bind:open={isCurrentPanelOpen}>
				<Header>
				<ContentCard isRoot={true} typeName={getTypeOrRefName(typeElement)} isOpen={isCurrentPanelOpen} clickCallback={() => handleCardClick(typeElement)} />
				</Header>
				<PanelContent class="panel-content">
						{#each typeElement.typeRefs as typeRef}
							<ContentCard isRoot={false} typeName={getTypeOrRefName(typeRef)} clickCallback={() => handleCardClick(typeRef)}/>
						{/each}
				</PanelContent>
			</Panel>
		{:else}
			<Panel nonInteractive>
				<Header ripple={false}>
						<ContentCard isRoot={true} typeName={getTypeOrRefName(typeElement)} displayArrow={false} clickCallback={() => handleCardClick(typeElement)} />
					</Header>
			</Panel>
		{/if}
	</Accordion>
</section>

<style>
#type-designer-card :global(.accordion) {
	padding: revert;
	padding-bottom:.25rem;
	}
#type-designer-card :global(.smui-accordion__panel--elevation-z1::before) {
	box-shadow: revert;
}

#type-designer-card :global(.smui-accordion__panel--open > .smui-paper__content) {
	gap: .25rem;
	padding: 0.25rem 0 1rem 0;
}

#type-designer-card :global(.panel-content) {
	display: flex;
	flex-direction: column;
	align-items: end;
}

#type-designer-card :global(.smui-accordion__header__title) {
	padding: revert;
}
			
</style>
	