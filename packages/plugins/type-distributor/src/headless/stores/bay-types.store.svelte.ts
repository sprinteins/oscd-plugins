import type {
	BayTypeWithTemplates,
	ConductingEquipmentTemplate,
	ConductingEquipmentType,
	FunctionTemplate,
	FunctionType
} from '../common-types'
import { ssdImportStore } from './ssd-import.store.svelte'

class UseBayTypesStore {
	private templateCache = new Map<string, BayTypeWithTemplates>()

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

	getBayTypeWithTemplates(bayUuid: string): BayTypeWithTemplates | null {
		const cached = this.templateCache.get(bayUuid)
		if (cached) return cached

		const bayType = this.bayTypes.find((b) => b.uuid === bayUuid)
		if (!bayType) return null

		const result: BayTypeWithTemplates = {
			...bayType,
			conductingEquipmentTemplates: this.getConductingEquipmentTemplates(
				bayType.conductingEquipments
			),
			functionTemplates: this.getFunctionTemplates(bayType.functions)
		}

		this.templateCache.set(bayUuid, result)
		return result
	}

	clearCache() {
		this.templateCache.clear()
	}
}

export const bayTypesStore = new UseBayTypesStore()
