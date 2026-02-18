import type {
	BayType,
	ConductingEquipmentTemplate,
	DAType,
	DOType,
	EnumType,
	FunctionTemplate,
	LNodeType
} from '@/headless/common-types'

import {
	parseBayTypes,
	parseTemplates,
	parseDataTypeTemplates
} from '@/headless/ssd-parsing'
import { bayTypesStore } from './bay-types.store.svelte'

class UseImportSSDStore {
	fileInput = $state<HTMLInputElement>()
	currentFilename = $state<string | null>(null)
	loadedSSDDocument = $state<XMLDocument | null>(null)

	// Templates
	bayTypes = $state<BayType[]>([])
	functionTemplates = $state<FunctionTemplate[]>([])
	conductingEquipmentTemplates = $state<ConductingEquipmentTemplate[]>([])

	// Data Type Templates
	lnodeTypes = $state<LNodeType[]>([])
	doTypes = $state<DOType[]>([])
	daTypes = $state<DAType[]>([])
	enumTypes = $state<EnumType[]>([])

	// Selection state
	selectedBayType = $state<string | null>(null)

	loadFromSSD(xmlDocument: XMLDocument, filename: string) {
		bayTypesStore.clearCache()

		this.bayTypes = parseBayTypes(xmlDocument)

		const templates = parseTemplates(xmlDocument)
		this.functionTemplates = templates.functionTemplates
		this.conductingEquipmentTemplates =
			templates.conductingEquipmentTemplates

		const dts = parseDataTypeTemplates(xmlDocument)
		this.lnodeTypes = dts.lnodeTypes
		this.doTypes = dts.doTypes
		this.daTypes = dts.daTypes
		this.enumTypes = dts.enumTypes

		this.loadedSSDDocument = xmlDocument
		this.currentFilename = filename
	}

	// Utility methods for matching templates
	getConductingEquipmentTemplate(
		uuid: string
	): ConductingEquipmentTemplate | undefined {
		return this.conductingEquipmentTemplates.find((t) => t.uuid === uuid)
	}

	getFunctionTemplate(uuid: string): FunctionTemplate | undefined {
		return this.functionTemplates.find((t) => t.uuid === uuid)
	}
}

export const ssdImportStore = new UseImportSSDStore()
