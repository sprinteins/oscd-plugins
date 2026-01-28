<script lang="ts">
import { Card } from '@oscd-plugins/core-ui-svelte'
import type { LNodeTemplate, EqFunctionTemplate, FunctionTemplate } from '@/headless/types'

interface Props {
    lnode: LNodeTemplate
    draggable?: boolean
    parentFunction?: EqFunctionTemplate | FunctionTemplate
    onDragStart?: (event: DragEvent, lnode: LNodeTemplate, parentFunction?: EqFunctionTemplate | FunctionTemplate) => void
    onDragEnd?: () => void
}

const { lnode, draggable = false, parentFunction, onDragStart, onDragEnd }: Props = $props()
</script>

<Card.Root
    draggable={draggable}
    {...{ ondragstart: (event: DragEvent) => onDragStart?.(event, lnode, parentFunction) }}
    {...{ ondragend: () => onDragEnd?.() }}
    class="hover:bg-gray-50 cursor-pointer transition-opacity"
>
    <Card.Content class="p-2">
        <span class="text-sm">{lnode.lnType}</span>
    </Card.Content>
</Card.Root>
