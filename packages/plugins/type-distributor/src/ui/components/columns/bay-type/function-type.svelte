<script lang="ts">
import { Card } from '@oscd-plugins/core-ui-svelte'
import { ChevronRight } from '@lucide/svelte'
import type { FunctionTemplate, LNodeTemplate } from '@/headless/common-types'
import { dndStore, assignedLNodesStore } from '@/headless/stores'
import { getLDeviceInst } from '@/headless/ied/elements'
import LNode from './lnode.svelte'

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

const lDeviceInst = $derived.by(() => getLDeviceInst(func))

let assignedStatuses = $derived(
    func.lnodes.map(lnode => assignedLNodesStore.isAssigned(lDeviceInst, lnode))
)

let allAssigned = $derived(
	func.lnodes.length > 0 && assignedStatuses.every(status => status)
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
        draggable={!allAssigned}
        ondragstart={allAssigned ? undefined : handleDragStart}
        ondragend={handleDragEnd}
        style:cursor={allAssigned ? "not-allowed" : (isDragging ? "grabbing" : "grab")}
    >
         <Card.Root
            class="hover:bg-gray-50 transition-opacity {isDragging
                ? 'opacity-50'
                : allAssigned ? 'opacity-50 cursor-not-allowed' : 'cursor-pointer'}"
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
            {#each func.lnodes as lnode, idx}
                <LNode
                    {lnode}
                    draggable={!assignedStatuses[idx]}
                    onDragStart={handleLNodeDragStart}
                    onDragEnd={handleLNodeDragEnd}
                />
            {/each}
        </div>
    {/if}
</div>
