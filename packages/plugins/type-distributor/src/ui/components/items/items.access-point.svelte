<script lang="ts">
	import { Card } from '@oscd-plugins/core-ui-svelte'
	import { ChevronRight } from '@lucide/svelte'
  import LnodeCard from './lnode-card.svelte';

	interface Props {
		accessPoint: Element
		sIedName: string
		lNodes: Element[]
	}

	const { accessPoint, sIedName, lNodes }: Props = $props()
	let isOpen = $state(false)
	let hasLNodes = $derived(lNodes.length > 0)
</script>

<div class="space-y-1">
	<button
		class="w-full"
		onclick={() => hasLNodes && (isOpen = !isOpen)}
		disabled={!hasLNodes}
	>
		<Card.Root
			class=" {hasLNodes
				? 'hover:bg-gray-50 cursor-pointer'
				: 'border border-dashed'}"
		>
			<Card.Content class="p-2">
				<div class="flex items-center justify-between">
					<div class="flex items-center gap-2">
						{#if hasLNodes}
							<ChevronRight
								class="size-4 transition-transform duration-200 {isOpen
									? 'rotate-90'
									: ''}"
							/>
						{/if}
						<span class="text-sm font-medium">
							Access Point {accessPoint.getAttribute('name') ?? '(unnamed)'}
							({sIedName})
						</span>
					</div>
				</div>
			</Card.Content>
		</Card.Root>
	</button>
	{#if isOpen && hasLNodes}
		<div class="ml-4 space-y-1">
			{#each lNodes as lnode}
      <LnodeCard lnode={{
				lnClass: lnode.getAttribute('lnClass') ?? '',
				lnType: lnode.getAttribute('lnType') ?? '',
				lnInst: lnode.getAttribute('lnInst') ?? '',
				iedName: lnode.getAttribute('iedName') ?? undefined
			}} />
			{/each}
		</div>
	{/if}
</div>
