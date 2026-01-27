<script lang="ts">
import { Card } from '@oscd-plugins/core-ui-svelte'
import { ChevronRight } from '@lucide/svelte'
import type { EqFunctionTemplate, LNodeTemplate } from '@/headless/types'
import { dndStore } from '@/headless/stores'
import LnodeCard from './lnode-card.svelte'

interface Props {
	eqFunction: EqFunctionTemplate
	equipmentName: string
}

const { eqFunction, equipmentName }: Props = $props()

let isOpen = $state(false)
let isDragging = $derived(
	dndStore.isDragging &&
	dndStore.currentDraggedItem?.type === 'equipmentFunction' &&
	dndStore.currentDraggedItem?.data.uuid === eqFunction.uuid
)

function handleDragStart(event: DragEvent) {
	dndStore.handleDragStart({
		type: 'equipmentFunction',
		data: eqFunction,
		equipmentName
	})
}

function handleDragEnd() {
	dndStore.handleDragEnd()
}

function handleLNodeDragStart(event: DragEvent, lnode: LNodeTemplate) {
    dndStore.handleDragStart({
        type: 'lNode',
        data: lnode,
        equipmentName
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
		style:cursor={isDragging ? 'grabbing' : 'grab'}
	>
        <Card.Root class="hover:bg-gray-50 cursor-pointer transition-opacity {isDragging ? 'opacity-50' : ''}">
            <Card.Content class="p-2">
                <div class="flex items-center justify-between">
                    <div class="flex items-center gap-2">
                        <ChevronRight
                            class="size-4 transition-transform duration-200 {isOpen
                                ? 'rotate-90'
                                : ''}"
                        />
                        <span class="text-sm font-medium"
                            >{eqFunction.name} ({equipmentName})</span
                        >
                    </div>
                </div>
            </Card.Content>
        </Card.Root>
    </button>
    {#if isOpen}
        <div class="ml-4 space-y-1">
            {#each eqFunction.lnodes as lnode}
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
