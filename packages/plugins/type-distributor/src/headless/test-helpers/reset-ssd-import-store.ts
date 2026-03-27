import { ssdImportStore } from '@/headless/stores/ssd-import.store.svelte'

export const resetSSDImportStore = () => {
	ssdImportStore.fileInput = undefined
	ssdImportStore.reset()
}
