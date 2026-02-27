import { ssdImportStore } from '@/headless/stores/ssd-import.store.svelte'

export const resetSSDImportStore = () => {
	ssdImportStore.fileInput = undefined
	ssdImportStore.currentFilename = null
	ssdImportStore.loadedSSDDocument = null
	ssdImportStore.bayTypes = []
	ssdImportStore.ld0FunctionTemplates = []
	ssdImportStore.functionTemplates = []
	ssdImportStore.conductingEquipmentTemplates = []
	ssdImportStore.lnodeTypes = []
	ssdImportStore.doTypes = []
	ssdImportStore.daTypes = []
	ssdImportStore.enumTypes = []
	ssdImportStore.selectedBayType = null
}
