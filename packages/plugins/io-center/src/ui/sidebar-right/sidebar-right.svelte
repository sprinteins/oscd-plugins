<script lang="ts">
import { Tabs } from '@oscd-plugins/core-ui-svelte'
// STORES
import { logicalStore } from '@/headless/stores'
// COMPONENTS
import LogicalTabContent from './logical-tab-content.svelte'
</script>

<aside class="flex flex-col bg-sidebar h-full p-4">
	<h2 class="font-black text-xl mb-6">Logical selector</h2>
	<Tabs.Root value="logical-conditioner" class="w-full h-full overflow-hidden">
		<Tabs.List class="grid w-full grid-cols-2">
			<Tabs.Trigger value="logical-conditioner" class="">Conditioner</Tabs.Trigger>
			<Tabs.Trigger value="logical-physical" class="">Physical</Tabs.Trigger>
		</Tabs.List>
		<Tabs.Content value="logical-conditioner" class="h-full overflow-hidden">
			<LogicalTabContent
				logicalKind="conditioner"
				logicalFilterValues={logicalStore.conditionerFilterValues}
				filteredLogicals={logicalStore.conditioners.filtered}
			/>
		</Tabs.Content>
		<Tabs.Content value="logical-physical" class="h-full overflow-hidden">
			<LogicalTabContent
				logicalKind="physical"
				logicalFilterValues={logicalStore.physicalFilterValues}
				filteredLogicals={logicalStore.physicals.filtered}
			/>
		</Tabs.Content>
	</Tabs.Root>
</aside>