<script lang="ts">
// COMPONENTS
import SingleColumn from '@/ui/components/column/single-column.svelte'
// STORES
import { typeElementsStore } from '@/headless/stores'
// TYPES
import type {
	Columns,
	Column as ColumnType,
	AvailableTypeFamily
} from '@/headless/stores'

const columnsEntries = $derived(Object.entries(typeElementsStore.columns)) as [
	keyof Columns,
	ColumnType<AvailableTypeFamily>
][]
</script>


<div class="grid grid-cols-4 gap-4 w-full h-full p-4 overflow-hidden">
	{#each columnsEntries as [key, column]}
		<SingleColumn columnKey={key} {column} />
	{/each}
</div>

