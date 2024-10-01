import { DataTypeTemplatesQueries } from "../scd-queries/data-type-templates/queries.data-type-templates"
// TYPES
import type { CommonOptions } from "../scd-queries/types.scd-queries"
import type { DataTypeTemplates } from "../index"

/** 
 * The name is temporary, rename it if you have a better one
 * UC = Use Case
 */
export class UCTypeDesigner {
	private dataTypeTemplatesQueries: DataTypeTemplatesQueries

	constructor(
		private readonly root: Element,
	) { this.dataTypeTemplatesQueries = new DataTypeTemplatesQueries(this.root) }

	public getElementTypeTreeStructure(): DataTypeTemplates.ElementsTreeStructure {
		return this.dataTypeTemplatesQueries.getElementTypeTreeStructure()
	}

	public findDataTypesElement(): DataTypeTemplates.RootElement {
		return this.dataTypeTemplatesQueries.searchDataTypeTemplates()
	}

	public findTypeDesignerElements(options?: CommonOptions): DataTypeTemplates.SubElements {
		return {
			logicalDevices: this.dataTypeTemplatesQueries.searchLDeviceElements(options),
			bays: this.dataTypeTemplatesQueries.searchBayElements(options),
			ieds: this.dataTypeTemplatesQueries.searchIEDElements(options),
			voltageLevels: this.dataTypeTemplatesQueries.searchVoltageLevelElements(options),
			substations: this.dataTypeTemplatesQueries.searchSubstationElements(options),
		}
	}

}
