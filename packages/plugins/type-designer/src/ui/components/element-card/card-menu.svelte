<script lang="ts">
// STORE
import { typeElementsStore } from '@/headless/stores'
// COMPONENTS
import { DropdownMenuWorkaround } from '@oscd-plugins/core-ui-svelte'
// TYPES
import type { AvailableTypeFamily, AvailableRefFamily } from '@/headless/stores'

//props
let {
	level,
	family,
	id
}: {
	level: 'type' | 'ref'
	family: Exclude<AvailableTypeFamily, 'lNodeType'> | AvailableRefFamily
	id: string
} = $props()

//====== FUNCTIONS ======//

function duplicateHandler() {
	if (level === 'type')
		typeElementsStore.duplicateType({
			family: family as Exclude<AvailableTypeFamily, 'lNodeType'>,
			id
		})
}

function deleteHandler() {
	if (level === 'type')
		typeElementsStore.deleteType({
			family: family as Exclude<AvailableTypeFamily, 'lNodeType'>,
			id
		})
}
</script>

<DropdownMenuWorkaround  actions={[
	{ label: 'Duplicate', disabled: false, callback: duplicateHandler },
	{ label: 'Delete', disabled: false, callback: deleteHandler }
]} />
