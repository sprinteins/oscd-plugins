import type {
	BayType,
	ConductingEquipmentTemplate,
	DAType,
	DOType,
	EnumType,
	FunctionTemplate,
	GeneralEquipmentTemplate,
	LNodeType
} from '@/headless/common-types'
import { assertCreationPrerequisites } from '@/headless/domain/type-resolution'

import {
	parseBayTypes,
	parseDataTypeTemplates,
	parseTemplates
} from '@/headless/ssd-parsing'

class UseImportSSDStore {
	fileInput = $state<HTMLInputElement>()
	currentFilename = $state<string | null>(null)
	loadedSSDDocument = $state<XMLDocument | null>(null)

	// Templates
	bayTypes = $state<BayType[]>([])
	functionTemplates = $state<FunctionTemplate[]>([])
	generalEquipmentTemplates = $state<GeneralEquipmentTemplate[]>([])
	conductingEquipmentTemplates = $state<ConductingEquipmentTemplate[]>([])

	// Data Type Templates
	lnodeTypes = $state<LNodeType[]>([])
	doTypes = $state<DOType[]>([])
	daTypes = $state<DAType[]>([])
	enumTypes = $state<EnumType[]>([])

	// Selection state
	selectedBayType = $state<string | null>(null)

	reset() {
		this.currentFilename = null
		this.loadedSSDDocument = null
		this.bayTypes = []
		this.functionTemplates = []
		this.generalEquipmentTemplates = []
		this.conductingEquipmentTemplates = []
		this.lnodeTypes = []
		this.doTypes = []
		this.daTypes = []
		this.enumTypes = []
		this.selectedBayType = null
	}

	loadFromSSD(xmlDocument: XMLDocument, filename: string) {
		try {
			const bayTypes = parseBayTypes(xmlDocument)

			const templates = parseTemplates(xmlDocument)
			const dts = parseDataTypeTemplates(xmlDocument)
			assertCreationPrerequisites(xmlDocument)

			this.selectedBayType = null
			this.bayTypes = bayTypes
			this.functionTemplates = templates.functionTemplates
			this.generalEquipmentTemplates = templates.generalEquipmentTemplates
			this.conductingEquipmentTemplates =
				templates.conductingEquipmentTemplates
			this.lnodeTypes = dts.lnodeTypes
			this.doTypes = dts.doTypes
			this.daTypes = dts.daTypes
			this.enumTypes = dts.enumTypes
			this.loadedSSDDocument = xmlDocument
			this.currentFilename = filename
		} catch (error) {
			this.reset()
			throw error
		}
	}

	// Utility methods for matching templates
	getConductingEquipmentTemplate(
		uuid: string
	): ConductingEquipmentTemplate | undefined {
		return this.conductingEquipmentTemplates.find((t) => t.uuid === uuid)
	}

	getGeneralEquipmentTemplate(
		uuid: string
	): GeneralEquipmentTemplate | undefined {
		return this.generalEquipmentTemplates.find((t) => t.uuid === uuid)
	}

	getFunctionTemplate(uuid: string): FunctionTemplate | undefined {
		return this.functionTemplates.find((t) => t.uuid === uuid)
	}
}

export const ssdImportStore = new UseImportSSDStore()
