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

function deleteHandler() {
	if (level === 'type')
		typeElementsStore.deleteType({
			family: family as Exclude<AvailableTypeFamily, 'lNodeType'>,
			id
		})
}
</script>

<DropdownMenuWorkaround  actions={[
	{ label: 'Delete', callback: deleteHandler }
]} />
