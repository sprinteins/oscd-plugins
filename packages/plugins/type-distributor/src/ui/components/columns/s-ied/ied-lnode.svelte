<script lang="ts">
import { Card, DropdownMenuWorkaround } from '@oscd-plugins/core-ui-svelte'
import { bayStore } from '@/headless/stores'
import { buildEditsForDeleteLNodeFromAccessPoint } from '@/headless/ied'
import { getDocumentAndEditor } from '@/headless/utils'
import type { LNodeTemplate } from '@/headless/common-types'

interface Props {
	lnode: LNodeTemplate
	lDeviceName: string
	iedName: string
	accessPointName: string
}

const { lnode, lDeviceName, iedName, accessPointName }: Props = $props()

function handleDelete() {
	if (!bayStore.scdBay) {
		console.error('[IedLnode] No bay selected')
		return
	}

	const { doc, editor } = getDocumentAndEditor()

	try {
		const edits = buildEditsForDeleteLNodeFromAccessPoint({
			doc,
			iedName,
			accessPointName,
			lDeviceInst: lDeviceName,
			lNode: {
				lnClass: lnode.lnClass,
				lnType: lnode.lnType,
				lnInst: lnode.lnInst
			},
			selectedBay: bayStore.scdBay
		})

		editor.commit(edits, {
			title: `Delete LNode ${lnode.lnClass}`,
			squash: true
		})
	} catch (error) {
		console.error('[IedLnode] Error deleting LNode:', error)
	}
}

</script>

<Card.Root
    class="hover:bg-gray-50 cursor-pointer transition-opacity"
>
    <Card.Content class="p-2">
        <div class="flex items-center justify-between">
            <span class="text-sm text-left">{lDeviceName} - {lnode.lnType}</span>
            <DropdownMenuWorkaround
                size="sm"
                actions={[
                    { label: 'Delete', disabled: false, callback: handleDelete }
                ]}
            />
        </div>
    </Card.Content>
</Card.Root>
