import { ssdImportStore } from '@/headless/stores'

export const resetSSDImportStore = () => {
	ssdImportStore.currentFilename = ''
	ssdImportStore.loadedSSDDocument = undefined
	ssdImportStore.bayTypes = []
	ssdImportStore.functionTemplates = []
	ssdImportStore.conductingEquipmentTemplates = []
}
