<script lang="ts">
// CORE
import { pluginGlobalStore } from '@oscd-plugins/core-ui-svelte'
// STORE
import { sidebarStore, typeElementsStore } from '@/headless/stores'
// COMPONENTS
import { DropdownMenuWorkaround, Sidebar } from '@oscd-plugins/core-ui-svelte'
// TYPES
import type { AvailableTypeFamily, AvailableRefFamily } from '@/headless/stores'

//props
let {
	type,
	ref
}: {
	type: {
		family: Exclude<AvailableTypeFamily, 'lNodeType'>
		id: string
	}
	ref?: {
		family: AvailableRefFamily
		id: string
	}
} = $props()

// actions
const sidebar = Sidebar.useSidebar()

//======= DERIVED STATES =======//

const level = $derived(ref ? 'ref' : 'type')

//====== FUNCTIONS ======//

//====== TYPES

function duplicateTypeHandler() {
	typeElementsStore.duplicateElement({
		element:
			typeElementsStore.typeElementsPerFamily[type.family][type.id]
				.element,
		family: type.family,
		kind: 'type'
	})
}

function deleteTypeHandler() {
	typeElementsStore.deleteTypeAndRefs({
		family: type.family,
		id: type.id
	})

	sidebarStore.resetCurrentElementType()
	sidebar.setOpen(false)
}

//====== REFS

function duplicateRefHandler() {
	if (!ref) throw new Error('Ref is not defined')
	typeElementsStore.duplicateElement({
		element:
			typeElementsStore.typeElementsPerFamily[type.family][type.id].refs[
				ref.family
			][ref.id].element,
		family: ref.family,
		kind: 'ref'
	})
}

function deleteRefHandler() {
	if (!ref) throw new Error('Ref is not defined')

	typeElementsStore.deleteRef({
		refElementToDelete:
			typeElementsStore.typeElementsPerFamily[type.family][type.id].refs[
				ref.family
			][ref.id].element,
		refFamily: ref.family
	})
}
</script>

{#if level === 'type'}
	<DropdownMenuWorkaround size="sm" actions={[
		{ label: 'Duplicate', disabled: false, callback: duplicateTypeHandler },
		{ label: 'Delete', disabled: false, callback: deleteTypeHandler }
	]} />
{:else if level === 'ref'}
	<DropdownMenuWorkaround size="sm" actions={[
		{ label: 'Duplicate', disabled: false, callback: duplicateRefHandler },
		{ label: 'Delete', disabled: false, callback: deleteRefHandler }
	]} />
{/if}