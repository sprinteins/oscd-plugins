<script lang="ts">
// CONSTANTS
import { SCD_ELEMENTS } from '@oscd-plugins/core'
// SMUI COMPONENTS
import Textfield from '@smui/textfield'
import Switch from '@smui/switch'
import FormField from '@smui/form-field'
import Button from '@smui/button'
// STORES
import { drawerStore } from '@oscd-plugins/ui'
import { pluginStore } from '@/stores/plugin.store'
import { elementsTypesStore } from '@/stores/elements-types.store'
import { dataTypeTemplatesStore } from '@/stores/data-type-templates.store'
// TYPES
import type {
	DataTypeTemplates,
	SubstationElement,
	Utils,
	LNodeElement
} from '@oscd-plugins/core'

//====== INITIALIZATION ====//

// props
export let currentTypeElement: Exclude<
	DataTypeTemplates.TypeElement,
	LNodeElement
>
export let currentColumnKey: keyof typeof SCD_ELEMENTS

let localAttributes: Partial<
	Record<(typeof standardAttributes)[number], string>
>
let currentParentTypeElements: {
	type: Utils.StrictExclude<DataTypeTemplates.TypeElement, SubstationElement>
	isAlreadyTypeRefToThisParent: boolean
}[]

// stores
const { columns } = elementsTypesStore

// local

//====== REACTIVITY ====//

$: ({ element, typeRefs, ...attributes } = currentTypeElement)
$: standardAttributes =
	SCD_ELEMENTS[currentColumnKey]?.element.standardAttributes
$: setNewLocalAttributes(attributes)
// typeRefs
$: currentTypeCanBeRefTo = SCD_ELEMENTS[currentColumnKey]?.typeRef.to
$: if (currentTypeCanBeRefTo)
	currentParentTypeElements = $columns[currentTypeCanBeRefTo].types.map(
		(currentParentType) => ({
			type: currentParentType,
			isAlreadyTypeRefToThisParent: currentParentType.typeRefs.some(
				(typeRef) => typeRef.type === currentTypeElement.id
			)
		})
	)

//====== FUNCTIONS =====//

function updateTypeElement() {
	pluginStore.createAndDispatchUpdateActionEvent({
		element,
		oldAttributes: attributes,
		newAttributes: localAttributes
	})
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

function handleTypeRef({
	type,
	isAlreadyTypeRefToThisParent
}: {
	type: DataTypeTemplates.TypeElement
	isAlreadyTypeRefToThisParent: boolean
}) {
	if (isAlreadyTypeRefToThisParent)
		dataTypeTemplatesStore.deleteTypeRef({
			currentType: type,
			currentTypeElementId: currentTypeElement.id
		})
	else
		dataTypeTemplatesStore.addNewTypeRef({
			columnKey: currentColumnKey,
			typeElement: type.element,
			refElement: element
		})
}
</script>

<div id="type-designer-drawer">
	<div class="drawer-content">
		<div class="form">
			{#each standardAttributes as attribute}
				{#if attribute !== 'id' && localAttributes[attribute] !== undefined}
					<Textfield class="textField" variant="outlined" bind:value={localAttributes[attribute]} label={attribute} on:blur={updateTypeElement} />
				{/if}
			{/each}
			
			{#if currentParentTypeElements?.length && currentColumnKey !== 'substation'}
				<p>Add current type as ref to these types :</p>
				<div class="type-ref">
					{#each currentParentTypeElements as parentTypeElement}
						<FormField>
							<Switch bind:checked={parentTypeElement.isAlreadyTypeRefToThisParent} icons={false} on:click={() => handleTypeRef(parentTypeElement)} />
							<span>{parentTypeElement.type.name}</span>
						</FormField>
					{/each}
				</div>
			{/if}
		</div>
		<Button class="button" on:click={drawerStore.handleCloseDrawer}>Cancel</Button>
	</div>
</div>

<style>
#type-designer-drawer {
	display: flex;
	height: 100%;
}

.drawer-content {
	display: flex;
	flex-direction: column;
	padding: 1rem;
}

.form {
	flex: 1;
	overflow-y: auto;	
}

.type-ref {
	display: flex;
	flex-direction: column;
	margin-bottom: 2rem;
}

#type-designer-drawer :global(.textField) {
	width: 100%;
	margin: 1rem 0;
}

#type-designer-drawer :global(.button) {
	color: var(--mdc-theme-secondary);
	margin-top: 0.75rem;
}
</style>