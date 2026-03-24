<script lang="ts">
import { Card, DropdownMenuWorkaround } from '@oscd-plugins/core-ui-svelte'
import { deleteLnodeFromAccessPoint } from '@/headless/actions'
import type { LNodeTemplate } from '@/headless/common-types'

interface Props {
	lnode: LNodeTemplate
	iedName: string
	accessPoint: Element
	isLD0?: boolean
}

const { lnode, iedName, accessPoint, isLD0 = false }: Props = $props()
</script>

<Card.Root
	class="hover:bg-gray-50 cursor-pointer transition-opacity"
	title="{lnode.lnClass} {lnode.lnInst} ({lnode.lnType})"
>
	<Card.Content class="p-2">
		<div class="flex items-center justify-between gap-2 min-w-0">
			<span class="text-sm text-left line-clamp-2 break-all min-w-0">
				{lnode.lnClass} {lnode.lnInst}</span
			>
			{#if lnode.lnClass !== "LLN0" && !isLD0}
				<div class="h-5 shrink-0 flex items-center">
					<DropdownMenuWorkaround
						size="sm"
						actions={[
							{
								label: "Delete",
								disabled: false,
								callback: () =>
									deleteLnodeFromAccessPoint({
										iedName,
										accessPoint,
										lnode,
									}),
							},
						]}
					/>
				</div>
			{/if}
		</div>
	</Card.Content>
</Card.Root>
