<script lang="ts">
import { buildEditsForDeleteEmptyIed } from '@/headless/scl/edits/delete-elements'
import { getEditor } from '@/headless/utils'
import { Card, DropdownMenuWorkaround } from '@oscd-plugins/core-ui-svelte'

interface Props {
	iedName: string
}

const { iedName }: Props = $props()

function handleDelete() {
	const editor = getEditor()
	const edit = buildEditsForDeleteEmptyIed(iedName)
	editor.commit(edit, {
		title: `Delete IED ${iedName}`
	})
}
</script>

<Card.Root class="border border-dashed text-gray-500">
  <Card.Content class="p-2">
    <div class="flex items-center justify-between">
      <span class="text-sm text-left">{iedName} - no Access Points found</span>
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
