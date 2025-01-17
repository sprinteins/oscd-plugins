export enum SignalType {
    GOOSE = 'GOOSE',
    MMS = 'MMS',
    SV = 'SV',
    UNKNOWN = 'UNKNOWN',
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
    M_text?: RegExp;
    signalType?: RegExp;
    IEDName?: RegExp;
    logicalNodeInofrmation?: {
        IEDName?: RegExp;
        LogicalDeviceInstance?: RegExp;
        LogicalNodePrefix?: RegExp;
        LogicalNodeClass?: RegExp;
        LogicalNodeInstance?: RegExp;
        LogicalNodeType?: RegExp;
    };
    dataObjectInformation?: {
        DataObjectName?: RegExp;
        DataAttributeName?: RegExp;
        CommonDataClass?: RegExp;
        AttributeType?: RegExp;
        FunctionalConstraint?: RegExp;
    };
}

export type MessageSubscriberFilter = {
    IDEName?: RegExp;
    serviceType?: RegExp;
}