<script lang="ts">
import { Card } from '@oscd-plugins/core-ui-svelte'
import { ChevronRight } from '@lucide/svelte'
import type { FunctionTemplate, LNodeTemplate } from '@/headless/types'
import { dndStore } from '@/headless/stores'
import LnodeCard from './lnode-card.svelte'

interface Props {
	func: FunctionTemplate
}

const { func }: Props = $props()

let isOpen = $state(false)
let isDragging = $derived(
	dndStore.isDragging &&
		dndStore.currentDraggedItem?.type === 'functionTemplate' &&
		dndStore.currentDraggedItem?.sourceFunction.uuid === func.uuid
)

function handleDragStart(event: DragEvent) {
	dndStore.handleDragStart({
		type: 'functionTemplate',
		sourceFunction: func,
		lNodes: func.lnodes || []
	})
}

function handleDragEnd() {
	dndStore.handleDragEnd()
}

function handleLNodeDragStart(event: DragEvent, lnode: LNodeTemplate) {
	dndStore.handleDragStart({
		type: 'lNode',
		sourceFunction: func,
		lNodes: [lnode]
	})
}

function handleLNodeDragEnd() {
	dndStore.handleDragEnd()
}
</script>

<div class="space-y-1">
    <button
        class="w-full"
        onclick={() => (isOpen = !isOpen)}
        draggable={true}
        ondragstart={handleDragStart}
        ondragend={handleDragEnd}
        style:cursor={isDragging ? "grabbing" : "grab"}
    >
        <Card.Root
            class="hover:bg-gray-50 cursor-pointer transition-opacity {isDragging
                ? 'opacity-50'
                : ''}"
        >
            <Card.Content class="p-2">
                <div class="flex items-center justify-between">
                    <div class="flex items-center gap-2">
                        <ChevronRight
                            class="size-4 transition-transform duration-200 {isOpen
                                ? 'rotate-90'
                                : ''}"
                        />
                        <span class="text-sm font-medium text-left"
                            >{func.name}</span
                        >
                    </div>
                </div>
            </Card.Content>
        </Card.Root>
    </button>
    {#if isOpen}
        <div class="ml-4 space-y-1">
            {#each func.lnodes as lnode}
                <LnodeCard
                    {lnode}
                    draggable={true}
                    onDragStart={handleLNodeDragStart}
                    onDragEnd={handleLNodeDragEnd}
                />
            {/each}
        </div>
    {/if}
</div>
