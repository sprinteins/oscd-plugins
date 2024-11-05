import { DataTypeTemplatesQueries } from './queries.data-type-templates'
// TYPES
import type { CommonOptions, PrivateElement } from '../types.scd-queries'
import type { DataTypeTemplates } from './types.data-type-templates'

export class DataTypeTemplatesService {
	private dataTypeTemplatesQueries: DataTypeTemplatesQueries

	constructor(private readonly root: Element) {
		this.dataTypeTemplatesQueries = new DataTypeTemplatesQueries(this.root)
	}

	public findDataTypesElement(): DataTypeTemplates.RootElement | null {
		return this.dataTypeTemplatesQueries.searchDataTypeTemplates()
	}

	public findPrivateElement(
		selector: `[type="${string}"]`,
		options?: CommonOptions
	): PrivateElement | null {
		return this.dataTypeTemplatesQueries.searchPrivateElement(
			selector,
			options
		)
	}

	public findTypeElements(
		options?: CommonOptions
	): DataTypeTemplates.TypeElements {
		return {
			substationTypes:
				this.dataTypeTemplatesQueries.searchSubstationTypeElements(
					options
				),
			voltageLevelTypes:
				this.dataTypeTemplatesQueries.searchVoltageLevelTypeElements(
					options
				),
			bayTypes:
				this.dataTypeTemplatesQueries.searchBayTypeElements(options),
			iedTypes:
				this.dataTypeTemplatesQueries.searchIEDTypeElements(options),
			lDeviceTypes:
				this.dataTypeTemplatesQueries.searchLDeviceTypeElements(
					options
				),
			lNodeTypes: this.dataTypeTemplatesQueries.searchLNodeTypeElements()
		}
	}
}
