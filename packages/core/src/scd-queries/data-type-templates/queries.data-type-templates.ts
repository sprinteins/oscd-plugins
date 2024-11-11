import { SCDQueries } from '../scd-queries'
// CONSTANTS
import { SCD_ELEMENTS } from '../../constants'
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
	): DataTypeTemplates.SubstationTypeElement[] {
		return this.searchElementsWithChildren<
			SubstationElement,
			'typeRefs',
			DataTypeTemplates.TypeRefElement
		>({
			selector: DataTypeTemplatesQueries.SelectorSubstationType,
			childrenKey: 'typeRefs',
			attributeList: [
				...SCD_ELEMENTS.substation.element.standardAttributes
			],
			options
		})
	}

	public static SelectorVoltageLevelType = 'VoltageLevelType'
	public searchVoltageLevelTypeElements(
		options?: CommonOptions
	): DataTypeTemplates.VoltageLevelTypeElement[] {
		return this.searchElementsWithChildren<
			VoltageLevelElement,
			'typeRefs',
			DataTypeTemplates.TypeRefElement
		>({
			selector: DataTypeTemplatesQueries.SelectorVoltageLevelType,
			childrenKey: 'typeRefs',
			attributeList: [
				...SCD_ELEMENTS.voltageLevel.element.standardAttributes
			],
			options
		})
	}

	public static SelectorBayType = 'BayType'
	public searchBayTypeElements(
		options?: CommonOptions
	): DataTypeTemplates.BayTypeElement[] {
		return this.searchElementsWithChildren<
			BayElement,
			'typeRefs',
			DataTypeTemplates.TypeRefElement
		>({
			selector: DataTypeTemplatesQueries.SelectorBayType,
			childrenKey: 'typeRefs',
			attributeList: [...SCD_ELEMENTS.bay.element.standardAttributes],
			options
		})
	}

	public static SelectorIEDType = 'IEDType'
	public searchIEDTypeElements(
		options?: CommonOptions
	): DataTypeTemplates.IEDTypeElement[] {
		return this.searchElementsWithChildren<
			IEDElement,
			'typeRefs',
			DataTypeTemplates.TypeRefElement
		>({
			selector: DataTypeTemplatesQueries.SelectorIEDType,
			childrenKey: 'typeRefs',
			attributeList: [...SCD_ELEMENTS.ied.element.standardAttributes],
			options
		})
	}

	public static SelectorLDeviceType = 'LDeviceType'
	public searchLDeviceTypeElements(
		options?: CommonOptions
	): DataTypeTemplates.LDeviceTypeElement[] {
		return this.searchElementsWithChildren<
			LDeviceElement,
			'typeRefs',
			DataTypeTemplates.TypeRefElement
		>({
			selector: DataTypeTemplatesQueries.SelectorLDeviceType,
			childrenKey: 'typeRefs',
			attributeList: [...SCD_ELEMENTS.lDevice.element.standardAttributes],
			options
		})
	}

	public static SelectorLNodeType = 'LNodeType'
	public searchLNodeTypeElements(
		options?: CommonOptions
	): DataTypeTemplates.LNodeTypeElement[] {
		return this.searchElements<LNodeElement>(
			DataTypeTemplatesQueries.SelectorLNodeType,
			[...SCD_ELEMENTS.lNode.element.standardAttributes],
			options
		).map((LNodeElement) => ({
			...LNodeElement,
			typeRefs: undefined
		}))
	}
}
