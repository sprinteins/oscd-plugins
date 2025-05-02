<script lang="ts">
// CORE
import {
	ToggleGroup,
	Button,
	Separator,
	TooltipWorkaround
} from '@oscd-plugins/core-ui-svelte'
// STORES
import { canvasStore, logicalStore } from '@/headless/stores'
// COMPONENTS
import { Edit, Square, SquareCheck, Trash2, X, Check } from 'lucide-svelte'
// TYPES
import type {
	LogicalKind,
	RawLogical,
	LogicalConditionerClass,
	LogicalPhysicalClass
} from '@/headless/stores'

//====== INITIALIZATION ======//

// props
let {
	logicalKind,
	selectedLogicalIds = $bindable(),
	filteredLogicals
}: {
	logicalKind: LogicalKind
	selectedLogicalIds: string[]
	filteredLogicals: RawLogical<
		LogicalConditionerClass | LogicalPhysicalClass
	>[]
} = $props()

//====== REACTIVE STATE ======//

let wantToRemoveThisLogical = $state()

//====== DERIVED ======//

const filteredLogicalsByClass = $derived(
	filteredLogicals.reduce(
		(
			acc: Record<
				string,
				RawLogical<LogicalConditionerClass | LogicalPhysicalClass>[]
			>,
			logical
		) => {
			const lnClass = logical.attributes.lnClass
			if (!acc[lnClass]) {
				acc[lnClass] = []
			}
			acc[lnClass].push(logical)
			return acc
		},
		{} as Record<
			string,
			RawLogical<LogicalConditionerClass | LogicalPhysicalClass>[]
		>
	)
)

//====== FUNCTIONS ======//

function handleRemoveLogical(
	currentLogical: RawLogical<LogicalConditionerClass | LogicalPhysicalClass>
) {
	logicalStore.removeLogical(currentLogical)
	wantToRemoveThisLogical = undefined
}
</script>


{#each Object.entries(filteredLogicalsByClass) as [logicalType, currentLogicals]}
	<div class="flex items-center w-full justify-between sticky top-0 bg-sidebar py-2 z-[1]">
		<Separator.Root class="w-1/3 bg-black"/>
			<h2 class="text-xl font-black text-black text-center w-1/3" >{logicalType}</h2>
		<Separator.Root class="w-1/3 bg-black"/>
	</div>
	<ToggleGroup.Root type="multiple" bind:value={selectedLogicalIds} class="group flex flex-col w-full">
		{#each currentLogicals as currentLogical (currentLogical.id)}

			{@const currentLogicalName = `${currentLogical.attributes.lnClass} - ${currentLogical.attributes.inst}`}
			{@const isSelected = selectedLogicalIds.includes(currentLogical.id)}
			{@const isLinked = canvasStore.isAtLeastOnePortConnected(currentLogical.ports)}

			<div class="flex items-center justify-between w-full">
				{#if !isSelected}
					{#if wantToRemoveThisLogical === currentLogical.id}
						<div class="flex">
							<Button.Root
								variant="ghost"
								class="invisible group-hover:visible size-7 rounded-full p-0 mr-2"
								onclick={() => handleRemoveLogical(currentLogical)}
							>
								<Check class="size-4"/>
							</Button.Root>
							<Button.Root
								variant="ghost"
								class="invisible group-hover:visible size-7 rounded-full p-0 mr-2 hover:bg-red-100 hover:text-red-900"
								onclick={() => wantToRemoveThisLogical = undefined}
							>
								<X class="size-4"/>
							</Button.Root>
						</div>
					{:else}
						<TooltipWorkaround position="left" text="Edit">
							<div class="flex">
								<Button.Root
									variant="ghost"
									class="invisible group-hover:visible size-7 rounded-full p-0 mr-2"
									onclick={() => logicalStore.fireLogicalDialogComponent({ logicalToEdit: currentLogical, logicalKind})}
								>
									<Edit class="size-4"/>
								</Button.Root>
								<Button.Root variant="ghost" class="invisible group-hover:visible size-7 rounded-full p-0 mr-2 hover:bg-red-100 hover:text-red-900" onclick={() => wantToRemoveThisLogical = currentLogical.id}>
									<Trash2 class="size-4"/>
								</Button.Root>
							</div>
						</TooltipWorkaround>
					{/if}
				{/if}
				<ToggleGroup.Item value={currentLogical.id} aria-label={`Toggle ${currentLogicalName}`} class="w-full flex items-center justify-between" disabled={isLinked}>
					{#if isSelected}
						{#if isLinked}
							<span>Linked</span>
						{:else}
							<SquareCheck class="size-4" />
						{/if}
					{:else}
						<span class="invisible group-hover:visible flex items-center justify-center">
							<Square class="size-4" />
						</span>
					{/if}
					{currentLogicalName}
				</ToggleGroup.Item>
			</div>
			
		{/each}
	</ToggleGroup.Root>
{/each}