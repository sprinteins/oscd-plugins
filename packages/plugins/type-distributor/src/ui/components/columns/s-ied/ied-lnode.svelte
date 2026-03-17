<script lang="ts">
import { Card, DropdownMenuWorkaround } from '@oscd-plugins/core-ui-svelte'
import type { LNodeTemplate } from '@/headless/common-types'
import { deleteLnodeFromAccessPoint } from '@/headless/actions'

interface Props {
	lnode: LNodeTemplate
	iedName: string
	accessPoint: Element
	isLD0?: boolean
}

const { lnode, iedName, accessPoint, isLD0 = false }: Props = $props()

// Display lnClass and lnInst (e.g., "ZREA 1" or "LLN0")
const displayName = $derived(
	lnode.lnInst ? `${lnode.lnClass} ${lnode.lnInst}` : lnode.lnClass
)
</script>

<Card.Root class="hover:bg-gray-50 cursor-pointer transition-opacity">
	<Card.Content class="p-2">
		<div class="flex items-center justify-between gap-2 min-w-0">
			<span
				class="text-sm text-left line-clamp-2 break-all min-w-0"
				title="{displayName} ({lnode.lnType})"
				>{displayName}</span
			>
			{#if lnode.lnClass !== 'LLN0' && !isLD0}
				<DropdownMenuWorkaround
					size="sm"
					actions={[
						{
							label: "Delete",
							disabled: false,
							callback: () => deleteLnodeFromAccessPoint({iedName, accessPoint, lnode})
						},
					]}
				/>
			{/if}
		</div>
	</Card.Content>
</Card.Root>
