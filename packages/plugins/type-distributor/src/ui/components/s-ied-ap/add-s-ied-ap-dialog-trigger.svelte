<script lang="ts">
import { Button, dialogStore } from '@oscd-plugins/core-ui-svelte'
import CreateIedForm from './add-s-ied-ap-dialog-form.svelte'

async function handleOpenDialog() {
	dialogStore.mountInnerComponent({
		innerComponent: CreateIedForm
	})
	await dialogStore.openDialog()
}
</script>

<Button.Root class="w-full" onclick={handleOpenDialog}>
	Add
</Button.Root>
