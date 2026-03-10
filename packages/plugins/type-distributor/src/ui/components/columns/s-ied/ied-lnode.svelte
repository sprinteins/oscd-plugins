<script lang="ts">
import { Card, DropdownMenuWorkaround } from '@oscd-plugins/core-ui-svelte'
import type { LNodeTemplate } from '@/headless/common-types'
import { deleteLnodeFromAccessPoint } from '@/headless/actions'

interface Props {
	lnode: LNodeTemplate
	iedName: string
	accessPoint: Element
}

const { lnode, iedName, accessPoint }: Props = $props()
</script>

<Card.Root class="hover:bg-gray-50 cursor-pointer transition-opacity">
	<Card.Content class="p-2">
		<div class="flex items-center justify-between gap-2 min-w-0">
			<span
				class="text-sm text-left line-clamp-2 break-all min-w-0"
				title="{lnode.ldInst} - {lnode.lnType}"
				>{lnode.ldInst} - {lnode.lnType}</span
			>
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
		</div>
	</Card.Content>
</Card.Root>
