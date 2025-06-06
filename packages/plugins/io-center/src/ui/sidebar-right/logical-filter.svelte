<script lang="ts">
// CORE
import {
	Separator,
	ToggleGroup,
	RadioGroup,
	Label
} from '@oscd-plugins/core-ui-svelte'
// TYPES
import type {
	LogicalKind,
	LogicalConditionerClass,
	LogicalPhysicalClass
} from '@/headless/stores'

//====== INITIALIZATION ======//

// props

let {
	logicalKind,
	filterScope = $bindable(),
	selectedLogicalClass = $bindable(),
	logicalClass
}: {
	logicalKind: LogicalKind
	filterScope: 'all' | 'linked' | 'unlinked'
	selectedLogicalClass: LogicalConditionerClass[] | LogicalPhysicalClass[]
	logicalClass: LogicalConditionerClass[] | LogicalPhysicalClass[]
} = $props()

//====== DERIVED ======//

const filterOptions = $derived(
	Object.values(logicalClass).map((lnClass) => ({
		value: lnClass,
		label: lnClass
	}))
)
</script>

<div class="space-y-5">
	<RadioGroup.Root
		bind:value={filterScope}
		onValueChange={() => selectedLogicalClass = []}
		class="flex w-full h-5 items-center justify-between"
	>
		<div class="flex items-center space-x-2 cursor-pointer">
			<RadioGroup.Item value="all" id={`all-${logicalKind}`}/>
			<Label.Root for={`all-${logicalKind}`} class="cursor-pointer">All</Label.Root>
		</div>
		<Separator.Root orientation="vertical" />
		<div class="flex items-center space-x-2">
			<RadioGroup.Item value="linked" id={`linked-${logicalKind}`} />
			<Label.Root for={`linked-${logicalKind}`} class="cursor-pointer">Linked</Label.Root>
		</div>
		<Separator.Root orientation="vertical" />
		<div class="flex items-center space-x-2 cursor-pointer">
			<RadioGroup.Item value="unlinked" id={`unlinked-${logicalKind}`} />
			<Label.Root for={`unlinked-${logicalKind}`} class="cursor-pointer">Unlinked</Label.Root>
		</div>
	</RadioGroup.Root>

	<div class="border rounded-md text-sm p-4">
		<ToggleGroup.Root type="multiple" bind:value={selectedLogicalClass} disabled={filterScope === 'all'} size="sm" class="flex w-full h-5 items-center justify-between">
			{#each filterOptions as option}
				<ToggleGroup.Item value={option.value} aria-label={`Toggle ${option.value}`}>
					{option.label}
				</ToggleGroup.Item>
			{/each}
		</ToggleGroup.Root>
	</div>
</div>