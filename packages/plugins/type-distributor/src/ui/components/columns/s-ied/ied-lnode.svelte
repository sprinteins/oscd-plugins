<script lang="ts">
import { Card, DropdownMenuWorkaround } from '@oscd-plugins/core-ui-svelte'
import type { LNodeTemplate } from '@/headless/common-types'
import { getEditor } from '@/headless/utils'
import { bayStore } from '@/headless/stores'
import { buildEditsForDeleteLNodeFromAccessPoint } from '@/headless/scl/edits/delete'

interface Props {
	lnode: LNodeTemplate
	iedName: string
	accessPoint: Element
}

const { lnode, iedName, accessPoint }: Props = $props()

function handleDelete() {
	const editor = getEditor()
	const edits = buildEditsForDeleteLNodeFromAccessPoint({
		iedName,
		accessPoint,
		lNodeTemplate: {
			lnClass: lnode.lnClass,
			lnType: lnode.lnType,
			lnInst: lnode.lnInst,
			ldInst: lnode.ldInst
		},
		selectedBay: bayStore.scdBay
	})
	if (!(edits.length > 0)) {
		console.warn(
			'[IedLnode] No edits generated for deleting LNode - check if LNode still exists'
		)
		return
	}
	editor.commit(edits, {
		title: `Delete LNode ${lnode.lnClass}`
	})
}
</script>

<Card.Root class="hover:bg-gray-50 cursor-pointer transition-opacity">
	<Card.Content class="p-2">
		<div class="flex items-center justify-between">
			<span class="text-sm text-left"
				>{lnode.ldInst} - {lnode.lnType}</span
			>
			<DropdownMenuWorkaround
				size="sm"
				actions={[
					{
						label: "Delete",
						disabled: false,
						callback: handleDelete,
					},
				]}
			/>
		</div>
	</Card.Content>
</Card.Root>
