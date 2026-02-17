import type {
	BayTypeWithTemplates,
	ConductingEquipmentTemplate,
	ConductingEquipmentType,
	FunctionTemplate,
	FunctionType,
	LNodeTemplate
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

	getAllLNodesWithParent(
		bayTypeWithTemplates: BayTypeWithTemplates
	): Array<{ parentUuid: string; lnode: LNodeTemplate }> {
		const result: Array<{ parentUuid: string; lnode: LNodeTemplate }> = []

		for (const instance of bayTypeWithTemplates.conductingEquipments) {
			const template =
				bayTypeWithTemplates.conductingEquipmentTemplateMap.get(
					instance.templateUuid
				)
			if (template?.eqFunctions) {
				for (const eqFunction of template.eqFunctions) {
					for (const lnode of eqFunction.lnodes) {
						result.push({ parentUuid: instance.uuid, lnode })
					}
				}
			}
		}

		for (const instance of bayTypeWithTemplates.functions) {
			const template = bayTypeWithTemplates.functionTemplateMap.get(
				instance.templateUuid
			)
			if (template?.lnodes) {
				for (const lnode of template.lnodes) {
					result.push({ parentUuid: instance.uuid, lnode })
				}
			}
		}

		return result
	}

	getBayTypeWithTemplates(bayUuid: string): BayTypeWithTemplates | null {
		const cached = this.templateCache.get(bayUuid)
		if (cached) return cached

		const bayType = this.bayTypes.find((b) => b.uuid === bayUuid)
		if (!bayType) return null

		const conductingEquipmentTemplates =
			this.getConductingEquipmentTemplates(bayType.conductingEquipments)
		const functionTemplates = this.getFunctionTemplates(bayType.functions)

		const result: BayTypeWithTemplates = {
			...bayType,
			conductingEquipmentTemplates,
			functionTemplates,
			conductingEquipmentTemplateMap: new Map(
				conductingEquipmentTemplates.map((t) => [t.uuid, t])
			),
			functionTemplateMap: new Map(
				functionTemplates.map((t) => [t.uuid, t])
			)
		}

		this.templateCache.set(bayUuid, result)
		return result
	}

	clearCache() {
		this.templateCache.clear()
	}
}

export const bayTypesStore = new UseBayTypesStore()
