import { dialogStore } from '@oscd-plugins/core-ui-svelte'
import ImportDialog from './import-dialog.svelte'

export async function loadFromCompas() {
	dialogStore.mountInnerComponent({
		innerComponent: ImportDialog
	})
	await dialogStore.openDialog()
}
