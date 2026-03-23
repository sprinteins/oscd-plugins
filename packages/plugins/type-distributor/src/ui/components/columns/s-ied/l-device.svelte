<script lang="ts">
import { ChevronRight } from '@lucide/svelte'
import { Card, DropdownMenuWorkaround } from '@oscd-plugins/core-ui-svelte'
import { deleteLDevice } from '@/headless/actions'
import type { LNodeTemplate } from '@/headless/common-types'
import IedLnode from './ied-lnode.svelte'

interface Props {
	ldInst: string
	displayLabel?: string
	lNodes: LNodeTemplate[]
	iedName: string
	accessPoint: Element
}

const { ldInst, displayLabel, lNodes, iedName, accessPoint }: Props = $props()

let isOpen = $state(false)
let hasLNodes = $derived(lNodes.length > 0)
let isLD0 = $derived(ldInst.startsWith('LD0'))
</script>

<div class="space-y-1">
	<button
		class="w-full"
		onclick={() => hasLNodes && (isOpen = !isOpen)}
	>
		<Card.Root
			class="{hasLNodes
				? 'hover:bg-gray-50 cursor-pointer'
				: 'border border-dashed'} 
			transition-all"
		>
			<Card.Content class="p-2 relative">
				<div class="flex items-center justify-between gap-2 min-w-0">
					<div class="flex items-center gap-2 min-w-0">
						{#if hasLNodes}
							<ChevronRight
								class="size-4 shrink-0 transition-transform duration-200 {isOpen
									? 'rotate-90'
									: ''}"
							/>
						{/if}
						<span class="text-sm font-medium text-left line-clamp-2 break-all" title={displayLabel ?? ldInst}>
							{displayLabel ?? ldInst}
						</span>
					</div>
					{#if !isLD0}
						<div
							class="h-5 shrink-0 flex items-center"
							onclick={(e) => e.stopPropagation()}
							role="button"
							tabindex="0"
							onkeydown={(e) => e.key === "Enter" && e.stopPropagation()}
						>
							<DropdownMenuWorkaround
								size="sm"
								actions={[
									{
										label: "Delete",
										disabled: false,
										callback: () => deleteLDevice({ iedName, accessPoint, ldInst })
									},
								]}
							/>
						</div>
					{/if}
				</div>
			</Card.Content>
		</Card.Root>
	</button>
	{#if isOpen && hasLNodes}
		<div class="ml-4 space-y-1">
			{#each lNodes as lnode}
				<IedLnode
					{lnode}
					{iedName}
					{accessPoint}
					{isLD0}
				/>
			{/each}
		</div>
	{/if}
</div>
