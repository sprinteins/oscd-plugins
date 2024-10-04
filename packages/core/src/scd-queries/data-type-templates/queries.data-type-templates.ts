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

	public static dataTypesTemplatesTree: DataTypeTemplates.ElementsTreeStructure =
		{
			substation: {
				elementName: ELEMENT_NAMES.substation,
				treeOrder: '1',
				tagName: 'SubstationType',
				children: ['voltageLevel']
			},
			voltageLevel: {
				elementName: ELEMENT_NAMES.voltageLevel,
				treeOrder: '1.1',
				tagName: 'VoltageLevelType',
				children: ['bay']
			},
			bay: {
				elementName: ELEMENT_NAMES.bay,
				treeOrder: '1.1.1',
				tagName: 'BayType',
				children: []
			},
			ied: {
				elementName: ELEMENT_NAMES.ied,
				treeOrder: '2',
				tagName: 'IEDType',
				children: ['lDevice']
			},
			lDevice: {
				elementName: ELEMENT_NAMES.lDevice,
				treeOrder: '2.1',
				tagName: 'LDeviceType',
				children: []
			}
		}

	public getElementTypeTreeStructure(): DataTypeTemplates.ElementsTreeStructure {
		return DataTypeTemplatesQueries.dataTypesTemplatesTree
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
		return this.searchElements<VoltageLevelElement>(
			DataTypeTemplatesQueries.SelectorVoltageLevelType,
			['id', 'name', 'desc', 'nomFreq', 'numPhases'],
			options
		)
	}

	public static SelectorSubstationType = 'SubstationType'
	public searchSubstationElements(
		options?: CommonOptions
	): SubstationElement[] {
		return this.searchElements<SubstationElement>(
			DataTypeTemplatesQueries.SelectorSubstationType,
			['id', 'name', 'desc'],
			options
		)
	}
}
