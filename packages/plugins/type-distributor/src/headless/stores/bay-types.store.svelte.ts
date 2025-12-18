import { ssdImportStore } from './ssd-import.store.svelte'

class UseBayTypesStore {
	get bayTypes() {
		return ssdImportStore.bayTypes
	}

	get selectedBayType() {
		return ssdImportStore.selectedBayType
	}

	set selectedBayType(value: string | null) {
		ssdImportStore.selectedBayType = value
	}

	// Get full bay type details with resolved templates
	getBayTypeWithTemplates(bayUuid: string) {
		const bayType = this.bayTypes.find((b) => b.uuid === bayUuid)
		if (!bayType) return null

		return {
			...bayType,
			conductingEquipmentTemplates: bayType.conductingEquipments
				.map((ce) => ssdImportStore.getConductingEquipmentTemplate(ce.templateUuid))
				.filter(Boolean),
			functionTemplates: bayType.functions
				.map((f) => ssdImportStore.getFunctionTemplate(f.templateUuid))
				.filter(Boolean)
		}
	}
}

export const bayTypesStore = new UseBayTypesStore()