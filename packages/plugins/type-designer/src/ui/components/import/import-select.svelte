<script lang="ts">
// CORE
import {
	compasStore,
	DropdownMenuWorkaround
} from '@oscd-plugins/core-ui-svelte'
// STORES
import { importsStore } from '@/headless/stores'
// COMPONENTS
import { Import } from 'lucide-svelte'
// TYPES
import type { Columns } from '@/headless/stores'

//====== INITIALIZATION ======//

// props
const {
	columnKey
}: {
	columnKey: Extract<keyof Columns, 'functionType' | 'lNodeType'>
} = $props()

// actions
const compasActions = [
	{
		label: 'Load from Compas',
		disabled: false,
		callback: () => importsStore.loadFromCompas(columnKey)
	}
]

const localActions = [
	{
		label: 'Load from local',
		disabled: false,
		callback: () => importsStore.fileInput[columnKey]?.click()
	}
]
</script>

{#await compasStore.isCompasEnabled}
	<DropdownMenuWorkaround icon={Import} size="md" actions={localActions} />
{:then isEnabled}
	<DropdownMenuWorkaround icon={Import} size="md" actions={[
		...(isEnabled ? compasActions : []),
		...localActions
	]} />
{/await}

<input type="file" bind:this={importsStore.fileInput[columnKey]} onchange={() => importsStore.loadFromLocal(columnKey)} class="hidden" />