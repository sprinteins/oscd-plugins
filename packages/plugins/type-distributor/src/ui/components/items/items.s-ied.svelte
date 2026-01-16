<script lang="ts">
import { Card } from '@oscd-plugins/core-ui-svelte'
import { ChevronRight } from '@lucide/svelte'
import type { LNodeTemplate } from '@/headless/types'
import LnodeCard from './lnode-card.svelte'

interface Props {
	accessPoint: Element
	lNodes: LNodeTemplate[]
}

const { accessPoint, lNodes }: Props = $props()

let isOpen = $state(false)
let hasLNodes = $derived(lNodes.length > 0);
$effect(() => {
  console.log('open state', isOpen, 'hasLNodes', hasLNodes);
});
</script>

<div class="space-y-1">
  <button class="w-full" onclick={() => (isOpen = !isOpen && hasLNodes)}>
    <Card.Root class="hover:bg-gray-50 cursor-pointer {hasLNodes ? '' : 'border border-dashed'}">
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
            <span class="text-sm font-medium"
              >{accessPoint.getAttribute("name") ?? "(unnamed AccessPoint)"}
              {accessPoint.getAttribute("desc") ?? "(no description)"}</span
            >
          </div>
        </div>
      </Card.Content>
    </Card.Root>
  </button>
  {#if isOpen && hasLNodes}
    <div class="ml-4 space-y-1">
      {#each lNodes as lnode}
        <LnodeCard {lnode} />
      {/each}
    </div>
  {/if}
</div>
