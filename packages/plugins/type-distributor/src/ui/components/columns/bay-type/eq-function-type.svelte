<script lang="ts">
import { ChevronRight } from '@lucide/svelte'
import { Card } from '@oscd-plugins/core-ui-svelte'
import type {
	ConductingEquipmentTemplate,
	EqFunctionTemplate,
	LNodeTemplate
} from '@/headless/common-types'
import { assignedLNodesStore, dndStore } from '@/headless/stores'
import LNode from './lnode.svelte'

interface Props {
	eqFunction: EqFunctionTemplate
	equipment: ConductingEquipmentTemplate
	bayTypeInstanceUuid: string
}

const { eqFunction, equipment, bayTypeInstanceUuid }: Props = $props()

let isOpen = $state(false)
let isDragging = $derived(
	dndStore.isDraggingItem(
		'equipmentFunction',
		eqFunction.uuid,
		bayTypeInstanceUuid
	)
)

const parentUuid = $derived(bayTypeInstanceUuid)

let assignedStatuses = $derived(
	eqFunction.lnodes.map((lnode) =>
		assignedLNodesStore.isAssigned({
			parentUuid,
			lnode,
			functionScopeUuid: eqFunction.uuid
		})
	)
)

let allAssigned = $derived(
	eqFunction.lnodes.length > 0 && assignedStatuses.every((status) => status)
)

function handleDragStart(_event: DragEvent) {
	dndStore.handleDragStart({
		type: 'equipmentFunction',
		sourceFunction: eqFunction,
		lNodes: eqFunction.lnodes || [],
		parentUuid,
		functionScopeUuid: eqFunction.uuid,
		equipmentUuid: parentUuid
	})
}

function handleDragEnd() {
	dndStore.handleDragEnd()
}

function handleLNodeDragStart(_event: DragEvent, lnode: LNodeTemplate) {
	dndStore.handleDragStart({
		type: 'lNode',
		sourceFunction: eqFunction,
		lNodes: [lnode],
		parentUuid,
		functionScopeUuid: eqFunction.uuid,
		equipmentUuid: parentUuid
	})
}

function handleLNodeDragEnd() {
	dndStore.handleDragEnd()
}

const eqLabel = $derived(`${eqFunction.name} (${equipment.name})`)
</script>

<div class="space-y-1">
    <button
        class="w-full"
        onclick={() => (isOpen = !isOpen)}
        draggable={!allAssigned}
        ondragstart={allAssigned ? undefined : handleDragStart}
        ondragend={handleDragEnd}
        style:cursor={allAssigned
            ? "not-allowed"
            : isDragging
              ? "grabbing"
              : "grab"}
    >
        <Card.Root
            class="hover:bg-gray-50 transition-opacity {isDragging
                ? 'opacity-50'
                : allAssigned
                  ? 'opacity-50 cursor-not-allowed'
                  : 'cursor-pointer'}"
        >
            <Card.Content class="p-2">
                <div class="flex items-center gap-2 min-w-0">
                    <ChevronRight
                        class="size-4 shrink-0 transition-transform duration-200 {isOpen
                            ? 'rotate-90'
                            : ''}"
                    />
                    <span
                        class="text-sm font-medium text-left line-clamp-2 break-all {allAssigned
                            ? 'text-gray-400'
                            : ''}"
                        title={eqLabel}
                    >
                        {eqLabel}
                    </span>
                </div>
            </Card.Content>
        </Card.Root>
    </button>
    {#if isOpen}
        <div class="ml-4 space-y-1">
            {#each eqFunction.lnodes as lnode, idx}
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
