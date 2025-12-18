<script lang="ts">
import { Card, Collapsible } from '@oscd-plugins/core-ui-svelte'
import { ChevronRight } from '@lucide/svelte'
import type { FunctionTemplate } from '@/headless/types'
import LnodeCard from './lnode-card.svelte'

const {
	func
}: {
	func: FunctionTemplate
} = $props()

let isOpen = $state(false)
</script>

<div class="space-y-1">
    <button class="w-full" onclick={() => (isOpen = !isOpen)}>
        <Card.Root class="hover:bg-gray-50 cursor-pointer">
            <Card.Content class="p-2">
                <div class="flex items-center justify-between">
                    <div class="flex items-center gap-2">
                        <ChevronRight
                            class="size-4 transition-transform duration-200 {isOpen
                                ? 'rotate-90'
                                : ''}"
                        />
                        <span class="text-sm font-medium">{func.name}</span>
                    </div>
                </div>
            </Card.Content>
        </Card.Root>
    </button>
    {#if isOpen}
        <div class="ml-4 space-y-1">
            {#each func.lnodes as lnode}
                <LnodeCard {lnode} />
            {/each}
        </div>
    {/if}
</div>
