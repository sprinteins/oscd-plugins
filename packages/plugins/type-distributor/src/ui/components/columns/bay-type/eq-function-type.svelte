<script lang="ts">
import { Card } from '@oscd-plugins/core-ui-svelte'
import { ChevronRight } from '@lucide/svelte'
import type { ConductingEquipmentTemplate, EqFunctionTemplate, LNodeTemplate } from '@/headless/common-types'
import { dndStore } from '@/headless/stores'
import LNode from './lnode.svelte'

interface Props {
	eqFunction: EqFunctionTemplate
	equipment: ConductingEquipmentTemplate
}

const { eqFunction, equipment }: Props = $props()

let isOpen = $state(false)
let isDragging = $derived(
	dndStore.isDragging &&
		dndStore.currentDraggedItem?.type === 'equipmentFunction' &&
		dndStore.currentDraggedItem?.sourceFunction.uuid === eqFunction.uuid
)

function handleDragStart(event: DragEvent) {
	dndStore.handleDragStart({
		type: 'equipmentFunction',
		sourceFunction: eqFunction,
		lNodes: eqFunction.lnodes || [],
		equipmentUuid: equipment.uuid
	})
}

function handleDragEnd() {
	dndStore.handleDragEnd()
}

function handleLNodeDragStart(event: DragEvent, lnode: LNodeTemplate) {
	dndStore.handleDragStart({
		type: 'lNode',
		sourceFunction: eqFunction,
		lNodes: [lnode],
		equipmentUuid: equipment.uuid
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
                <div class="flex items-center gap-2">
                    <ChevronRight
                        class="size-4 transition-transform duration-200 {isOpen
                            ? 'rotate-90'
                            : ''}"
                    />
                    <span class="text-sm font-medium text-left">
                        {eqFunction.name} ({equipment.name})
                    </span>
                </div>
            </Card.Content>
        </Card.Root>
    </button>
    {#if isOpen}
        <div class="ml-4 space-y-1">
            {#each eqFunction.lnodes as lnode}
                <LNode
                    {lnode}
                    draggable={true}
                    onDragStart={handleLNodeDragStart}
                    onDragEnd={handleLNodeDragEnd}
                />
            {/each}
        </div>
    {/if}
</div>
