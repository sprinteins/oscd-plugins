<script lang="ts">
// CORE
import { Button } from '@oscd-plugins/core-ui-svelte'
// STORES
import { logicalStore } from '@/headless/stores'
// COMPONENTS
import { CirclePlus } from 'lucide-svelte'
import SearchBar from '@/ui/common/search-bar.svelte'
import LogicalFilter from './logical-filter.svelte'
import LogicalList from './logical-list.svelte'

// TYPES
import type {
	LogicalKind,
	RawLogical,
	LogicalConditionerClass,
	LogicalPhysicalClass,
	LogicalFilterValues
} from '@/headless/stores'

//====== INITIALIZATION ======//

// props
let {
	logicalKind,
	logicalFilterValues,
	filteredLogicals
}: {
	logicalKind: LogicalKind
	logicalFilterValues: LogicalFilterValues<
		LogicalConditionerClass[] | LogicalPhysicalClass[]
	>
	filteredLogicals: RawLogical<
		LogicalConditionerClass | LogicalPhysicalClass
	>[]
} = $props()
</script>

<div class="flex flex-col overflow-hidden h-full mt-3 space-y-5 pb-16">
	<section>
		<Button.Root onclick={() => logicalStore.fireLogicalDialogComponent({ logicalKind })} class="w-full flex items-center" variant="ghost">
			<CirclePlus />
			<span>Add a logical {logicalKind}</span>
		</Button.Root>
	</section>

	<section class="space-y-5">
		<SearchBar bind:searchInputValue={logicalFilterValues.searchInput} placeholder="Search LC" />
		<LogicalFilter
			{logicalKind}
			logicalClass={logicalFilterValues.availableLogicalClass}
			bind:filterScope={logicalFilterValues.scope}
			bind:selectedLogicalClass={logicalFilterValues.selectedLogicalClass}
		/>
	</section>

	<section class="overflow-y-auto relative">
		<LogicalList bind:selectedLogicalIds={logicalFilterValues.selectedLogicalIds} {filteredLogicals} {logicalKind} />
	</section>
</div>