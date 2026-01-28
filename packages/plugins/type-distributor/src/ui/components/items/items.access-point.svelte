<script lang="ts">
import { Card } from '@oscd-plugins/core-ui-svelte'
import { ChevronRight } from '@lucide/svelte'
import LnodeCard from './lnode-card.svelte'
import type { LNodeTemplate } from '@/headless/types'

interface Props {
	accessPoint: Element
	sIedName: string
	lNodes: LNodeTemplate[]
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
              {sIedName} - Access Point {accessPoint.getAttribute("name") ?? "(unnamed)"}
            </span>
          </div>
        </div>
      </Card.Content>
    </Card.Root>
  </button>
  {#if isOpen && hasLNodes}
    <div class="ml-4 space-y-1">
      {#each lNodes as lnode}
        <!--We are going to need to update the lNode object and its type eventually. It does also need to know of what is being dragged into this Element -->
        <LnodeCard {lnode} />
      {/each}
    </div>
  {/if}
</div>
