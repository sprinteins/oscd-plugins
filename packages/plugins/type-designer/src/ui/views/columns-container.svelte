<script lang="ts">
// COMPONENTS
import Column from '@/ui/components/column/column.svelte'
// STORES
import { elementTypesStore } from '@/headless/stores/element-types.svelte'
// TYPES
import type { Columns } from '@/headless/stores/types.element-types'
</script>



<div  class="grid grid-cols-4 min-h-full gap-4 w-full p-4">
{#each Object.entries(elementTypesStore.columns) as [key, column]}
	<Column columnKey={key as keyof Columns} {column} />
{/each}
</div>

