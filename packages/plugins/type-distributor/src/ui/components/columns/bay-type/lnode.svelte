<script lang="ts">
import { Card } from '@oscd-plugins/core-ui-svelte'
import type { LNodeTemplate } from '@/headless/common-types'

interface Props {
	lnode: LNodeTemplate
	draggable?: boolean
	onDragStart?: (event: DragEvent, lnode: LNodeTemplate) => void
	onDragEnd?: () => void
}

const { lnode, draggable = false, onDragStart, onDragEnd }: Props = $props()

function handleDragStart(event: DragEvent) {
	if (!draggable) return
	onDragStart?.(event, lnode)
}

function handleDragEnd() {
	if (!draggable) return
	onDragEnd?.()
}
</script>

<Card.Root
    draggable={draggable}
    ondragstart={handleDragStart}
    ondragend={handleDragEnd}
    class="hover:bg-gray-50 transition-opacity {draggable 
        ? 'cursor-pointer' 
        : 'opacity-50 cursor-not-allowed '}"
>
    <Card.Content class="p-2">
        <span class="text-sm text-left {draggable ? '' : 'text-gray-400'}">
            {lnode.lnType}
        </span>
    </Card.Content>
</Card.Root>
