<script lang="ts">
import { Card, DropdownMenuWorkaround } from '@oscd-plugins/core-ui-svelte'
import { deleteEmptyIed } from '@/headless/actions'

interface Props {
	iedName: string
}

const { iedName }: Props = $props()
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
            callback: () => deleteEmptyIed(iedName),
          },
        ]}
      />
    </div>
  </Card.Content>
</Card.Root>
