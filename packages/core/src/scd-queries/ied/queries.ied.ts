import { SCDQueries } from '@/scd-queries/scd-queries'
// CONSTANTS
import { SCD_ELEMENTS } from '@/constants'
// TYPES
import type {
	CommonOptions,
	IEDElement,
	IEDElementStandardAttributes,
	ReportControlElement,
	ClientLNElement,
	InputsElement,
	ExtRefStandardAttributes,
	ExtRefElement,
	GSEControlElement
} from '@/scd-queries'

export class IEDQueries extends SCDQueries {
	//====== PUBLIC METHODS

	public static SelectorIED = SCD_ELEMENTS.ied.element.tag
	public static AttributeListIED: Array<keyof IEDElementStandardAttributes> =
		['name']
	public searchIEDs(options?: CommonOptions): IEDElement[] {
		return this.searchElement<IEDElement>(
			IEDQueries.SelectorIED,
			IEDQueries.AttributeListIED,
			options
		)
	}

	public static SelectorReportControl = SCD_ELEMENTS.reportControl.element.tag
	public searchReportControls(
		options?: CommonOptions
	): ReportControlElement[] {
		return this.searchElement<ReportControlElement>(
			IEDQueries.SelectorReportControl,
			['rptID', 'name', 'datSet'],
			options
		)
	}

	public static SelectorClientLN = SCD_ELEMENTS.clientLN.element.tag
	public searchClientLNs(options?: CommonOptions): ClientLNElement[] {
		return this.searchElement<ClientLNElement>(
			IEDQueries.SelectorClientLN,
			['iedName'],
			options
		)
	}

	public static SelectorInput = SCD_ELEMENTS.inputs.element.tag
	public searchInputs(options?: CommonOptions): InputsElement[] {
		return this.searchElement<InputsElement>(
			IEDQueries.SelectorInput,
			[],
			options
		)
	}

	public static SelectorExtRef = SCD_ELEMENTS.extRef.element.tag
	public static AttributeListExtRef: Array<keyof ExtRefStandardAttributes> = [
		'iedName',
		'serviceType',
		'srcCBName'
	]
	public searchExtRef(options?: CommonOptions): ExtRefElement[] {
		return this.searchElement<ExtRefElement>(
			IEDQueries.SelectorExtRef,
			IEDQueries.AttributeListExtRef,
			options
		)
	}

	public static SelectorGSEControl = SCD_ELEMENTS.gseControl.element.tag
	public searchGSEControlByName(
		cbName: string,
		options?: CommonOptions
	): GSEControlElement {
		return this.searchElement<GSEControlElement>(
			`${IEDQueries.SelectorGSEControl}[name='${cbName}']`,
			['name', 'datSet'],
			options
		)[0]
	}
}
