<script lang="ts">
import { Card, DropdownMenuWorkaround } from '@oscd-plugins/core-ui-svelte'
import { buildEditsForDeleteLNodeFromAccessPoint } from '@/headless/ied/delete-elements'
import type { LNodeTemplate } from '@/headless/common-types'
import { getEditor } from '@/headless/utils'

interface Props {
	lnode: LNodeTemplate
	lDeviceName: string
	sIedName: string
	accessPoint: Element
}

const { lnode, lDeviceName, sIedName, accessPoint }: Props = $props()

function handleDelete() {
	try {
		const editor = getEditor()
		const edits = buildEditsForDeleteLNodeFromAccessPoint(
			sIedName,
			accessPoint,
			lDeviceName,
			{
				lnClass: lnode.lnClass,
				lnType: lnode.lnType,
				lnInst: lnode.lnInst
			}
		)
		if (!(edits.length > 0)) {
			console.warn(
				'[IedLnode] No edits generated for deleting LNode - check if LNode still exists'
			)
			return
		}
		editor.commit(edits, {
			title: `Delete LNode ${lnode.lnClass}`
		})
	} catch (error) {
		console.error('[IedLnode] Error deleting LNode:', error)
	}
}
</script>

<Card.Root class="hover:bg-gray-50 cursor-pointer transition-opacity">
	<Card.Content class="p-2">
		<div class="flex items-center justify-between">
			<span class="text-sm text-left">{lDeviceName} - {lnode.lnType}</span
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
