import { ssdImportStore } from '@/headless/stores/ssd-import.store.svelte'

export const INVALID_XML_IMPORT_MESSAGE =
	'The selected file is not a valid XML SSD.'

export const NO_FILE_SELECTED_MESSAGE = 'No file selected'

export async function loadFromLocal() {
	const file = ssdImportStore.fileInput?.files?.[0]
	if (!file) throw new Error(NO_FILE_SELECTED_MESSAGE)

	const xmlDocument = new DOMParser().parseFromString(
		await file.text(),
		'application/xml'
	)

	if (ssdImportStore.fileInput) ssdImportStore.fileInput.value = ''

	if (xmlDocument.querySelector('parsererror')) {
		ssdImportStore.reset()
		throw new Error(INVALID_XML_IMPORT_MESSAGE)
	}

	ssdImportStore.loadFromSSD(xmlDocument, file.name)
}
