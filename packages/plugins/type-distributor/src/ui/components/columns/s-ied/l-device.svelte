<script lang="ts">
import { ChevronRight } from '@lucide/svelte'
import { Card, DropdownMenuWorkaround } from '@oscd-plugins/core-ui-svelte'
import { deleteLDevice } from '@/headless/actions'
import type { LNodeTemplate } from '@/headless/common-types'
import IedLnode from './ied-lnode.svelte'

interface Props {
	ldInst: string
	lNodes: LNodeTemplate[]
	iedName: string
	accessPoint: Element
}

const { ldInst, lNodes, iedName, accessPoint }: Props = $props()

let isOpen = $state(false)
let hasLNodes = $derived(lNodes.length > 0)
let isLD0 = $derived(ldInst.startsWith('LD0'))
</script>

<div class="space-y-1">
	<Card.Root
		class="{hasLNodes
			? 'hover:bg-gray-50'
			: 'border border-dashed'} transition-all"
	>
		<Card.Content class="p-2 relative">
			<div class="flex items-center justify-between gap-2 min-w-0">
				<button
					type="button"
					class="flex min-w-0 flex-1 items-center gap-2 text-left"
					disabled={!hasLNodes}
					aria-expanded={hasLNodes ? isOpen : undefined}
					onclick={() => (isOpen = !isOpen)}
				>
					{#if hasLNodes}
						<ChevronRight
							class="size-4 shrink-0 transition-transform duration-200 {isOpen
								? 'rotate-90'
								: ''}"
						/>
					{/if}
					<span
						class="text-sm font-medium line-clamp-2 break-all"
						title={ldInst}
					>
						{ldInst}
					</span>
				</button>
				{#if !isLD0}
					<div class="h-5 shrink-0 flex items-center">
						<DropdownMenuWorkaround
							size="sm"
							actions={[
								{
									label: 'Delete',
									disabled: false,
									callback: () =>
										deleteLDevice({ iedName, accessPoint, ldInst })
								}
							]}
						/>
					</div>
				{/if}
			</div>
		</Card.Content>
	</Card.Root>
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
