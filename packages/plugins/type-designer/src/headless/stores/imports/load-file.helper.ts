import { dialogStore } from '@oscd-plugins/core-ui-svelte'
// STORES
import { importsStore } from '@/headless/stores'
// COMPONENTS
import ImportDialog from '@/ui/components/import/compas/import-dialog.svelte'

export async function loadFromCompas() {
	importsStore.lastImportSource = 'compas'

	dialogStore.mountInnerComponent({
		innerComponent: ImportDialog
	})
	await dialogStore.openDialog()
}

export async function loadFromLocal() {
	const file = importsStore.fileInput?.files?.[0]
	if (!file) throw new Error('No file selected')

	const xmlDocument = new DOMParser().parseFromString(
		await file.text(),
		'application/xml'
	)

	importsStore.currentFilename = file.name
	importsStore.lastImportSource = 'local'

	importsStore.loadedXmlDocument = xmlDocument

	if (importsStore.fileInput) importsStore.fileInput.value = ''
}
