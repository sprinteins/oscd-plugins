<script lang="ts">
import { Card } from '@oscd-plugins/core-ui-svelte'
import type { LNodeTemplate } from '@/headless/common-types'

interface Props {
	lnode: LNodeTemplate
	lDeviceName: string
}

const { lnode, lDeviceName }: Props = $props()
</script>

<Card.Root
    class="hover:bg-gray-50 cursor-pointer transition-opacity"
>
    <Card.Content class="p-2">
        <span class="text-sm text-left">{lDeviceName} - {lnode.lnType}</span>
    </Card.Content>
</Card.Root>
