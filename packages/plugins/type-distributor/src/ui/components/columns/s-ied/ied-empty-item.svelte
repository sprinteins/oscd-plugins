<script lang="ts">
import {
	Card,
	DropdownMenuWorkaround,
	dialogStore
} from '@oscd-plugins/core-ui-svelte'
import { deleteEmptyIed } from '@/headless/actions'
import { RenameIedDialogForm } from './rename-dialogs'

interface Props {
	iedName: string
	iedElement: Element
}

const { iedName, iedElement }: Props = $props()

async function handleRename() {
	dialogStore.mountInnerComponent({
		innerComponent: RenameIedDialogForm,
		innerComponentProps: {
			currentIedName: iedName,
			currentDescription: iedElement.getAttribute('desc') ?? '',
			iedElement
		}
	})
	await dialogStore.openDialog()
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
            label: "Rename",
            disabled: false,
            callback: handleRename,
          },
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
