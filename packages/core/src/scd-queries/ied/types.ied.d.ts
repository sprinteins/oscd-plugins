// CONSTANTS
import type { SCD_ELEMENTS } from '@/constants/element.constant'
// TYPES
import type {
	SCDBaseElement,
	AllowedElements,
	SubstationElement,
	VoltageLevelElement,
	BayElement,
	IEDElement,
	LDeviceElement,
	LNodeElement,
	ExtRefElement
} from '../types.scd-queries'

export namespace IED {
	export type CommunicationInfo = {
		iedName: string
		iedDetails: Details
		published: PublishedMessage[]
		received: ReceivedMessage[]
	}

	export type Details = {
		logicalNodes: string[]
		dataObjects: string[]
		dataAttributes: string[]
	}

	export type PublishedMessage = {
		id: string
		name: string
		targetIEDName: string
		serviceType: string
		serviceDatSet: string
		serviceCbName: string
	}

	export type ReceivedMessage = {
		iedName: string // to show
		serviceType: string // to filter
		srcCBName: string // to show
		datSet: string | null // to show
		data: ExtRefElementWithDatSet[]
	}

	export type ReportControlInfo = {
		clientIEDName: string
		rptID: string
		name: string
	}

	export type ExtRefElementWithDatSet = ExtRefElement & {
		datSet: string | null
	}
}
