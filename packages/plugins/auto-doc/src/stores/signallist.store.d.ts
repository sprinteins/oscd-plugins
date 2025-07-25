import type {
	MESSAGE_PUBLISHER,
	MESSAGE_SUBSCRIBER,
	SUBSCRIBER_EXT_REF
} from '@/constants'

/* 
    The keys of SignalType and Columns are used for the searchKey in SignalRow. 
    check signal-list-element.svelte for more information
*/
export enum SignalType {
	GOOSE = 'GOOSE',
	MMS = 'Report',
	SV = 'SMV'
}

export enum Columns {
	UW = 'UW',
	VoltageLevel = 'Voltage Level',
	Bay = 'Bay',
	M_text = 'Meldetext',
	IEDName = 'IED Name',
	// LN Infos
	LogicalDeviceInstance = 'Logical Device Instance',
	LogicalNodePrefix = 'Logical Node Prefix',
	LogicalNodeClass = 'Logical Node Class',
	LogicalNodeInstance = 'Logical Node Instance',
	// DO Infos
	DataObjectName = 'Data Object Name',
	DataAttributeName = 'Data Attribute Name',
	CommonDataClass = 'Common Data Class',
	AttributeType = 'AttributeType',
	FunctionalConstraint = 'Functional Constraint'
}

export type MessagePublisher = {
	[MESSAGE_PUBLISHER.UW]: string
	[MESSAGE_PUBLISHER.VoltageLevel]: string
	[MESSAGE_PUBLISHER.Bay]: string
	[MESSAGE_PUBLISHER.M_text]: string
	[MESSAGE_PUBLISHER.SignalType]: string
	[MESSAGE_PUBLISHER.TargetIEDName]: string
	[MESSAGE_PUBLISHER.IEDName]: string
	[MESSAGE_PUBLISHER.LogicalNodeInformation]: LogicalNodeInformation
	[MESSAGE_PUBLISHER.DataObjectInformation]: DataObjectInformation
}

export type LogicalNodeInformation = {
	[MESSAGE_PUBLISHER.IEDName]: string
	[MESSAGE_PUBLISHER.LogicalDeviceInstance]: string
	[MESSAGE_PUBLISHER.LogicalNodePrefix]: string
	[MESSAGE_PUBLISHER.LogicalNodeClass]: string
	[MESSAGE_PUBLISHER.LogicalNodeInstance]: string
	[MESSAGE_PUBLISHER.LogicalNodeType]: string
}

export type DataObjectInformation = {
	[MESSAGE_PUBLISHER.DataObjectName]: string
	[MESSAGE_PUBLISHER.DataAttributeName]: string
	[MESSAGE_PUBLISHER.CommonDataClass]: string
	[MESSAGE_PUBLISHER.AttributeType]: string
	[MESSAGE_PUBLISHER.FunctionalConstraint]: string
}

export type InvalditiesReport = {
	IEDName: string
	invalidities: string
}

export type MessagePublisherFilter = {
	UW?: string
	VoltageLevel?: string
	Bay?: string
	M_text?: string
	signalType?: string
	IEDName?: string
	LogicalNodeIEDName?: string
	LogicalDeviceInstance?: string
	LogicalNodePrefix?: string
	LogicalNodeClass?: string
	LogicalNodeInstance?: string
	LogicalNodeType?: string
	DataObjectName?: string
	DataAttributeName?: string
	CommonDataClass?: string
	AttributeType?: string
	FunctionalConstraint?: string
}
type IEDNameSearch = string

export type MessageSubscriberFilter = {
	[SignalType.GOOSE]?: IEDNameSearch
	[SignalType.MMS]?: IEDNameSearch
	[SignalType.SV]?: IEDNameSearch
}

export type PdfRowStructure = {
	matchedFilteredValuesForPdf: string[][]
	publisher: MessagePublisher
	matchedSubscribers: {
		[SignalType.GOOSE]: string[]
		[SignalType.MMS]: string[]
		[SignalType.SV]: string[]
	}
}

export type SignalRow = {
	id: string
	index: number
	isSelected: boolean
	primaryInput: string
	secondaryInput: string
	label: LabelText
	searchKey: keyof typeof SignalType | keyof typeof Columns
}

export type SignalRow = {
	id: string
	index: number
	isSelected: boolean
	primaryInput: string
	secondaryInput: string
	label: LabelText
	searchKey: keyof typeof SignalType | keyof typeof Columns
}
