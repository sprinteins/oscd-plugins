<script lang="ts">
import { Card } from '@oscd-plugins/core-ui-svelte'
import type { LNodeRef } from '@/headless/types'

const {
	lnode
}: {
	lnode: LNodeRef
} = $props()
</script>

<Card.Root>
    <Card.Content class="p-2">
        <span class="text-sm">{lnode.lnType}</span>
    </Card.Content>
</Card.Root>
