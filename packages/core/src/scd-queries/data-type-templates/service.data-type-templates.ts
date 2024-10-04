import { DataTypeTemplatesQueries } from './queries.data-type-templates'
// TYPES
import type { CommonOptions } from '../types.scd-queries'
import type { DataTypeTemplates } from './types.data-type-templates'

export class DataTypeTemplatesService {
	private dataTypeTemplatesQueries: DataTypeTemplatesQueries

	constructor(private readonly root: Element) {
		this.dataTypeTemplatesQueries = new DataTypeTemplatesQueries(this.root)
	}

	public findDataTypesElement(): DataTypeTemplates.RootElement | null {
		return this.dataTypeTemplatesQueries.searchDataTypeTemplates()
	}

	public findTypeDesignerElements(
		options?: CommonOptions
	): DataTypeTemplates.SubElements {
		return {
			logicalDevices:
				this.dataTypeTemplatesQueries.searchLDeviceElements(options),
			bays: this.dataTypeTemplatesQueries.searchBayElements(options),
			ieds: this.dataTypeTemplatesQueries.searchIEDElements(options),
			voltageLevels:
				this.dataTypeTemplatesQueries.searchVoltageLevelElements(
					options
				),
			substations:
				this.dataTypeTemplatesQueries.searchSubstationElements(options)
		}
	}
}
