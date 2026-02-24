import type {
	BayType,
	BayTypeWithTemplates,
	ConductingEquipmentType,
	ConductingEquipmentTemplate,
	FunctionType,
	FunctionTemplate,
	LNodeTemplate
} from '../common-types'
import { ssdImportStore } from './ssd-import.store.svelte'

let cachedBayTypesRef: BayType[] | null = null
const templateCache = new Map<string, BayTypeWithTemplates>()

function ensureCacheValid(currentBayTypes: BayType[]) {
	if (cachedBayTypesRef !== currentBayTypes) {
		templateCache.clear()
		cachedBayTypesRef = currentBayTypes
	}
}

function resolveConductingEquipmentTemplates(
	conductingEquipments: ConductingEquipmentType[]
): ConductingEquipmentTemplate[] {
	return conductingEquipments
		.map((ce) => ssdImportStore.getConductingEquipmentTemplate(ce.templateUuid))
		.filter((t): t is ConductingEquipmentTemplate => t != null)
}

function resolveFunctionTemplates(functions: FunctionType[]): FunctionTemplate[] {
	return functions
		.map((f) => ssdImportStore.getFunctionTemplate(f.templateUuid))
		.filter((t): t is FunctionTemplate => t != null)
}

export function getBayTypeWithTemplates(bayUuid: string): BayTypeWithTemplates | null {
	const { bayTypes } = ssdImportStore
	ensureCacheValid(bayTypes)

	const cached = templateCache.get(bayUuid)
	if (cached) return cached

	const bayType = bayTypes.find((b) => b.uuid === bayUuid)
	if (!bayType) return null

	const conductingEquipmentTemplates = resolveConductingEquipmentTemplates(
		bayType.conductingEquipments
	)
	const functionTemplates = resolveFunctionTemplates(bayType.functions)

	const result: BayTypeWithTemplates = {
		...bayType,
		conductingEquipmentTemplates,
		functionTemplates,
		conductingEquipmentTemplateMap: new Map(
			conductingEquipmentTemplates.map((t) => [t.uuid, t])
		),
		functionTemplateMap: new Map(functionTemplates.map((t) => [t.uuid, t]))
	}

	templateCache.set(bayUuid, result)
	return result
}

export function getAllLNodesWithParent(
	bayTypeWithTemplates: BayTypeWithTemplates
): Array<{ parentUuid: string; lnode: LNodeTemplate }> {
	const result: Array<{ parentUuid: string; lnode: LNodeTemplate }> = []

	for (const instance of bayTypeWithTemplates.conductingEquipments) {
		const template = bayTypeWithTemplates.conductingEquipmentTemplateMap.get(
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
		const template = bayTypeWithTemplates.functionTemplateMap.get(instance.templateUuid)
		if (template?.lnodes) {
			for (const lnode of template.lnodes) {
				result.push({ parentUuid: instance.uuid, lnode })
			}
		}
	}

	return result
}
