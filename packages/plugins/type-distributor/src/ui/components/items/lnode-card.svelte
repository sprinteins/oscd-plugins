<script lang="ts">
import { Card } from '@oscd-plugins/core-ui-svelte'
import type { LNodeTemplate } from '@/headless/types'

interface Props {
	lnode: LNodeTemplate
}

const { lnode }: Props = $props()
</script>

<Card.Root>
    <Card.Content class="p-2">
        <span class="text-sm">{lnode.lnType}</span>
    </Card.Content>
</Card.Root>
