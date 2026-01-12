import type {
	ConductingEquipmentTemplate,
	ConductingEquipmentType,
	FunctionTemplate,
	FunctionType
} from '../types'
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

	private getConductingEquipmentTemplates(
		conductingEquipments: ConductingEquipmentType[]
	): ConductingEquipmentTemplate[] {
		return conductingEquipments
			.map((ce) =>
				ssdImportStore.getConductingEquipmentTemplate(ce.templateUuid)
			)
			.filter(
				(template): template is ConductingEquipmentTemplate =>
					template != null
			)
	}

	private getFunctionTemplates(
		functions: FunctionType[]
	): FunctionTemplate[] {
		return functions
			.map((f) => ssdImportStore.getFunctionTemplate(f.templateUuid))
			.filter(
				(template): template is FunctionTemplate => template != null
			)
	}

	// Get full bay type details with resolved templates
	getBayTypeWithTemplates(bayUuid: string) {
		const bayType = this.bayTypes.find((b) => b.uuid === bayUuid)
		if (!bayType) return null

		return {
			...bayType,
			conductingEquipmentTemplates: this.getConductingEquipmentTemplates(
				bayType.conductingEquipments
			),
			functionTemplates: this.getFunctionTemplates(bayType.functions)
		}
	}
}

export const bayTypesStore = new UseBayTypesStore()
