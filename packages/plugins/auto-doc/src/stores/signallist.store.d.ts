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
    M_text: string;
    signalType: SignalType;
    IEDName: string;
    logicalNodeInofrmation: LogicalNodeInformation;
    dataObjectInformation: DataObjectInformation;
}

export type MessageSubscriber = {
    IDEName: string;
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
    IEDName: string;
    LogicalDeviceInstance: string;
    LogicalNodePrefix: string;
    LogicalNodeClass: string;
    LogicalNodeInstance: string;
    LogicalNodeType:string;
}

export type DataObjectInformation = {
    DataObjectName: string;
    DataAttributeName: string;
    CommonDataClass: string;
    AttributeType: string;
    FunctionalConstraint: string;
}

export type InvalditiesReport = {
    IEDName: string;
    LogicalNodeInformation: LogicalNodeInformation;
    invalidities: string[];
}

export type MessagePublisherFilter = {
    M_text?: string;
    signalType?: string;
    IEDName?: string;
    logicalNodeInofrmation?: {
        IEDName?: string;
        LogicalDeviceInstance?: string;
        LogicalNodePrefix?: string;
        LogicalNodeClass?: string;
        LogicalNodeInstance?: string;
        LogicalNodeType?: string;
    };
    dataObjectInformation?: {
        DataObjectName?: string;
        DataAttributeName?: string;
        CommonDataClass?: string;
        AttributeType?: string;
        FunctionalConstraint?: string;
    };
}

export type MessageSubscriberFilter = {
    IDEName?: string;
    serviceType?: string;
}