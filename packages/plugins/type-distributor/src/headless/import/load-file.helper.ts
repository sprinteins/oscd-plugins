import { ssdImportStore } from '@/headless/stores/ssd-import.store.svelte'

export async function loadFromLocal() {
	const file = ssdImportStore.fileInput?.files?.[0]
	if (!file) throw new Error('No file selected')

	const xmlDocument = new DOMParser().parseFromString(
		await file.text(),
		'application/xml'
	)

	if (ssdImportStore.fileInput) ssdImportStore.fileInput.value = ''
	ssdImportStore.loadFromSSD(xmlDocument, file.name)
}
