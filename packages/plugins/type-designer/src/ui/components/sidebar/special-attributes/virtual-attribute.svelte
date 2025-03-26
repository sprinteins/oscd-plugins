	
<script lang="ts">
// COMPONENTS
import { Switch } from '@oscd-plugins/core-ui-svelte'
// STORES
import { sidebarStore } from '@/headless/stores'

//====== INITIALIZATION ======//

const { onChangeHandler }: { onChangeHandler: (attributeKey: string) => void } =
	$props()

//====== GETTERS / SETTERS ======//

function getVirtualValue() {
	return sidebarStore.currentElementType?.attributes.virtual === 'true'
}

function setVirtualValue(value: boolean) {
	if (sidebarStore.currentElementType)
		sidebarStore.currentElementType.attributes.virtual = value
			? 'true'
			: 'false'
	onChangeHandler('virtual')
}
</script>

<Switch.Root
class="mt-1 self-end"
bind:checked={
	getVirtualValue,
	setVirtualValue
}
disabled={sidebarStore.isCurrentElementImported}
/>