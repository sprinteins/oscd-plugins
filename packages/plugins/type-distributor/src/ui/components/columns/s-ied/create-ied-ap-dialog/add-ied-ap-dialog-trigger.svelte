<script lang="ts">
import { Button, dialogStore } from '@oscd-plugins/core-ui-svelte'
import { MISSING_SSD_CREATION_MESSAGE } from '@/headless/domain/type-resolution'
import { ssdImportStore } from '@/headless/stores'
import CreateIedForm from './add-ied-ap-dialog-form.svelte'

const isAddDisabled = $derived(!ssdImportStore.loadedSSDDocument)

const addButtonTitle = $derived.by(() => {
	if (isAddDisabled) {
		return MISSING_SSD_CREATION_MESSAGE
	}

	return 'Create an S-IED or add Access Points.'
})

async function handleOpenDialog() {
	if (isAddDisabled) {
		return
	}

	dialogStore.mountInnerComponent({
		innerComponent: CreateIedForm
	})
	await dialogStore.openDialog()
}
</script>

<div title={addButtonTitle} class="w-full">
	<Button.Root
		class="w-full"
		onclick={handleOpenDialog}
		disabled={isAddDisabled}
	>
		Add
	</Button.Root>
</div>