import { SCDQueries } from '../scd-queries'
// CONSTANTS
import { ELEMENT_NAMES } from '../../constants/element.constant'
// TYPES
import type {
	CommonOptions,
	LDeviceElement,
	BayElement,
	IEDElement,
	VoltageLevelElement,
	SubstationElement
} from '../types.scd-queries'
import type { DataTypeTemplates } from './types.data-type-templates'

export class DataTypeTemplatesQueries extends SCDQueries {
	constructor(root: Element) {
		super(root)
		if (!ELEMENT_NAMES) {
			throw new Error('ELEMENT_NAMES is not initialized')
		}
	}

	public static SelectorDataTypeTemplates = 'DataTypeTemplates'
	public searchDataTypeTemplates(): DataTypeTemplates.RootElement | null {
		return this.searchSingleElement<DataTypeTemplates.RootElement>(
			DataTypeTemplatesQueries.SelectorDataTypeTemplates,
			[]
		)
	}

	public static SelectorLDeviceType = 'LDeviceType'
	public searchLDeviceElements(options?: CommonOptions): LDeviceElement[] {
		return this.searchElements<LDeviceElement>(
			DataTypeTemplatesQueries.SelectorLDeviceType,
			['id', 'desc', 'inst'],
			options
		)
	}

	public static SelectorBayType = 'BayType'
	public searchBayElements(options?: CommonOptions): BayElement[] {
		return this.searchElements<BayElement>(
			DataTypeTemplatesQueries.SelectorBayType,
			['id', 'name', 'desc'],
			options
		)
	}

	public static SelectorIEDType = 'IEDType'
	public searchIEDElements(options?: CommonOptions): IEDElement[] {
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

	public static SelectorVoltageLevelType = 'VoltageLevelType'
	public searchVoltageLevelElements(
		options?: CommonOptions
	): VoltageLevelElement[] {
		const voltageLevels = this.searchElements<VoltageLevelElement>(
			DataTypeTemplatesQueries.SelectorVoltageLevelType,
			['id', 'name', 'desc', 'nomFreq', 'numPhases'],
			options
		)

		return voltageLevels.map((voltageLevel) => {
			const bays = Array.from(
				voltageLevel.element.querySelectorAll(
					DataTypeTemplatesQueries.SelectorBayType
				)
			).map((bayElem) =>
				this.createElement<BayElement>(bayElem, ['id', 'name', 'desc'])
			)
			return { ...voltageLevel, refElements: bays }
		})
	}

	public static SelectorSubstationType = 'SubstationType'
	public searchSubstationElements(
		options?: CommonOptions
	): SubstationElement[] {
		const substations = this.searchElements<SubstationElement>(
			DataTypeTemplatesQueries.SelectorSubstationType,
			['id', 'name', 'desc'],
			options
		)

		return substations.map((substation) => {
			const voltageLevels = Array.from(
				substation.element.querySelectorAll(
					DataTypeTemplatesQueries.SelectorVoltageLevelType
				)
			).map((voltageLevelEl) =>
				this.createElement<VoltageLevelElement>(voltageLevelEl, [
					'id',
					'name',
					'desc',
					'nomFreq',
					'numPhases'
				])
			)
			return { ...substation, refElements: voltageLevels }
		})
	}
}
