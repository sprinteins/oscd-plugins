<script lang="ts">
import { Card } from '@oscd-plugins/core-ui-svelte'
import type { LNodeTemplate } from '@/headless/types'

interface Props {
	lnode: LNodeTemplate
	draggable?: boolean
	onDragStart?: (event: DragEvent, lnode: LNodeTemplate) => void
	onDragEnd?: () => void
}

const { lnode, draggable = false, onDragStart, onDragEnd }: Props = $props()
</script>

<Card.Root
    {draggable}
    {...{ ondragstart: (event: DragEvent) => onDragStart?.(event, lnode) }}
    {...{ ondragend: () => onDragEnd?.() }}
    class="hover:bg-gray-50 cursor-pointer transition-opacity"
>
    <Card.Content class="p-2">
        <span class="text-sm text-left">{lnode.lnType}</span>
    </Card.Content>
</Card.Root>
