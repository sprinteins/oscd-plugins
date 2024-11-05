import { SCDQueries } from '../scd-queries'
// TYPES
import type {
	CommonOptions,
	PrivateElement,
	SubstationElement,
	VoltageLevelElement,
	BayElement,
	IEDElement,
	LDeviceElement,
	LNodeElement
} from '../types.scd-queries'
import type { DataTypeTemplates } from './types.data-type-templates'

export class DataTypeTemplatesQueries extends SCDQueries {
	public static SelectorDataTypeTemplates = 'DataTypeTemplates'
	public searchDataTypeTemplates(): DataTypeTemplates.RootElement | null {
		return this.searchSingleElement<DataTypeTemplates.RootElement>(
			DataTypeTemplatesQueries.SelectorDataTypeTemplates,
			[]
		)
	}

	public searchPrivateElement(
		selector: `[type="${string}"]`,
		options?: CommonOptions
	): PrivateElement | null {
		return (
			this.searchElements<PrivateElement>(selector, [], options)[0] ||
			null
		)
	}

	public static SelectorSubstationType = 'SubstationType'
	public searchSubstationTypeElements(
		options?: CommonOptions
	): SubstationElement[] {
		return this.searchElements<SubstationElement>(
			DataTypeTemplatesQueries.SelectorSubstationType,
			['id', 'name', 'desc'],
			options
		)
	}

	public static SelectorVoltageLevelType = 'VoltageLevelType'
	public searchVoltageLevelTypeElements(
		options?: CommonOptions
	): VoltageLevelElement[] {
		return this.searchElements<VoltageLevelElement>(
			DataTypeTemplatesQueries.SelectorVoltageLevelType,
			['id', 'name', 'desc', 'nomFreq', 'numPhases'],
			options
		)
	}

	public static SelectorBayType = 'BayType'
	public searchBayTypeElements(options?: CommonOptions): BayElement[] {
		return this.searchElements<BayElement>(
			DataTypeTemplatesQueries.SelectorBayType,
			['id', 'name', 'desc'],
			options
		)
	}

	public static SelectorIEDType = 'IEDType'
	public searchIEDTypeElements(options?: CommonOptions): IEDElement[] {
		return this.searchElements<IEDElement>(
			DataTypeTemplatesQueries.SelectorIEDType,
			[
				'id',
				'name',
				'desc',
				'originalSclRevision',
				'originalSclVersion',
				'configVersion',
				'owner',
				'manufacturer',
				'type'
			],
			options
		)
	}

	public static SelectorLDeviceType = 'LDeviceType'
	public searchLDeviceTypeElements(
		options?: CommonOptions
	): LDeviceElement[] {
		return this.searchElements<LDeviceElement>(
			DataTypeTemplatesQueries.SelectorLDeviceType,
			['id', 'desc', 'inst'],
			options
		)
	}

	public static SelectorLNodeType = 'LNodeType'
	public searchLNodeTypeElements(options?: CommonOptions): LNodeElement[] {
		return this.searchElements<LNodeElement>(
			DataTypeTemplatesQueries.SelectorLNodeType,
			['id', 'name', 'desc', 'lnClass'],
			options
		)
	}
}
