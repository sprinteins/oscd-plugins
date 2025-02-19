import type { MESSAGE_PUBLISHER } from "@/constants/messages";

/* 
    The keys of SignalType and Columns are used for the searchKey in SignalRow. 
    check signal-list-element.svelte for more information
*/
export enum SignalType {
    GOOSE = 'GOOSE',
    MMS = 'MMS',
    SV = 'SV',
    UNKNOWN = 'UNKNOWN',
}

export enum Columns{
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
    [MESSAGE_PUBLISHER.UW]: string;
    [MESSAGE_PUBLISHER.VoltageLevel]: string;
    // [MESSAGE_PUBLISHER.Bay]: string;
    [MESSAGE_PUBLISHER.M_text]: string;
    [MESSAGE_PUBLISHER.SignalType]: string;
    [MESSAGE_PUBLISHER.IEDName]: string;
    [MESSAGE_PUBLISHER.LogicalNodeInformation]: LogicalNodeInformation;
    [MESSAGE_PUBLISHER.DataObjectInformation]: DataObjectInformation;
}


export type MessageSubscriber = {
    IEDName: string;
    ExtRef: ExtRef
}
export type ExtRef = {
    iedName:string;
    serviceType:SignalType;
    ldInst:string;
    lnClass:string;
    lnInst:string;
    prefix:string;
    doName:string;
    daName:string;
    srcLDInst:string;
    srcPrefix:string;
    srcLNClass:string;
    srcCBName:string;
}

export type LogicalNodeInformation = {
    [MESSAGE_PUBLISHER.IEDName]: string;
    [MESSAGE_PUBLISHER.LogicalDeviceInstance]: string;
    [MESSAGE_PUBLISHER.LogicalNodePrefix]: string;
    [MESSAGE_PUBLISHER.LogicalNodeClass]: string;
    [MESSAGE_PUBLISHER.LogicalNodeInstance]: string;
    [MESSAGE_PUBLISHER.LogicalNodeType]: string;
}

export type DataObjectInformation = {
    [MESSAGE_PUBLISHER.DataObjectName]: string;
    [MESSAGE_PUBLISHER.DataAttributeName]: string;
    [MESSAGE_PUBLISHER.CommonDataClass]: string;
    [MESSAGE_PUBLISHER.AttributeType]: string;
    [MESSAGE_PUBLISHER.FunctionalConstraint]: string;
}

export type InvalditiesReport = {
    IEDName: string;
    LogicalNodeInformation: LogicalNodeInformation;
    invalidities: string[];
}

export type MessagePublisherFilter = {
    UW?: string;
    VoltageLevel?: string;
    Bay?: string;
    M_text?: string;
    signalType?: string;
    IEDName?: string;
    LogicalNodeIEDName?: string;
    LogicalDeviceInstance?: string;
    LogicalNodePrefix?: string;
    LogicalNodeClass?: string;
    LogicalNodeInstance?: string;
    LogicalNodeType?: string;
    DataObjectName?: string;
    DataAttributeName?: string;
    CommonDataClass?: string;
    AttributeType?: string;
    FunctionalConstraint?: string;
}

export type MessageSubscriberFilter = {
    IEDName?: string;
    serviceType?: string;
}


export type MessageSubscriberAndPdfContent = {
    subscribers: MessageSubscriber[];
    matchedRows: PdfRowStructure[];
}

export type PdfRowStructure = {
    matchedFilteredValuesForPdf: string[][],
    publisher: MessagePublisher
    matchedSubscribers: string[]
}