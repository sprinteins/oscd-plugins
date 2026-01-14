import { ssdImportStore } from '@/headless/stores'

export const resetSSDImportStore = () => {
	ssdImportStore.fileInput = undefined
	ssdImportStore.currentFilename = null
	ssdImportStore.loadedSSDDocument = null
	ssdImportStore.bayTypes = []
	ssdImportStore.functionTemplates = []
	ssdImportStore.conductingEquipmentTemplates = []
	ssdImportStore.lnodeTypes = []
	ssdImportStore.doTypes = []
	ssdImportStore.daTypes = []
	ssdImportStore.enumTypes = []
	ssdImportStore.selectedBayType = null
}
