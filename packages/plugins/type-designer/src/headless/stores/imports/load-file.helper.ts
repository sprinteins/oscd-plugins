import { dialogStore } from '@oscd-plugins/core-ui-svelte'
import { loadElements } from './imported-type-crud-operation.helper'
// STORES
import { importsStore } from '@/headless/stores'
// COMPONENTS
import ImportDialog from '@/ui/components/import/compas/import-dialog.svelte'
// TYPES
import type {
	Columns,
	AvailableColumnsWhereImportIsAllowed
} from '@/headless/stores'

export function loadFromCompas(
	currentColumnKey: AvailableColumnsWhereImportIsAllowed
) {
	importsStore.currentImportColumnKey = currentColumnKey
	importsStore.lastImportSource = 'compas'
	dialogStore.innerComponent = ImportDialog
	dialogStore.openDialog()
}

export async function loadFromLocal(
	currentColumnKey: Extract<keyof Columns, 'functionType' | 'lNodeType'>
) {
	const file = importsStore.fileInput[currentColumnKey]?.files?.[0]
	if (!file) throw new Error('No file selected')

	importsStore.currentImportColumnKey = currentColumnKey
	importsStore.currentFilenameByColumnKey[currentColumnKey] = file.name
	importsStore.lastImportSource = 'local'

	importsStore.importedXmlDocument = new DOMParser().parseFromString(
		await file.text(),
		'application/xml'
	)
	loadElements()

	if (importsStore.fileInput[currentColumnKey])
		importsStore.fileInput[currentColumnKey].value = ''
}
