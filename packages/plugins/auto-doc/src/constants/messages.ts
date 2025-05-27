export const MESSAGE_PUBLISHER = {
    UW: 'UW',
    VoltageLevel: 'VoltageLevel',
    Bay: 'Bay',
    M_text: 'M_text',
    IEDName: 'IEDName',
    SignalType: 'signalType',
    TargetIEDName: 'targetIEDName',
    LogicalNodeInformation: "logicalNodeInformation",
    LogicalDeviceInstance: "LogicalDeviceInstance",
    LogicalNodePrefix: "LogicalNodePrefix",
    LogicalNodeClass: "LogicalNodeClass",
    LogicalNodeInstance: "LogicalNodeInstance",
    LogicalNodeType: "LogicalNodeType",
    LogicalNodeIEDName: "LogicalNodeIEDName",
    DataObjectInformation: "dataObjectInformation",
    DataObjectName: "DataObjectName",
    DataAttributeName: "DataAttributeName",
    CommonDataClass: "CommonDataClass",
    AttributeType: "AttributeType",
    FunctionalConstraint: "FunctionalConstraint"
} as const


export const MESSAGE_SUBSCRIBER = {
    IEDName : 'IEDName',
    ExtRef: 'ExtRef'
} as const

export const SUBSCRIBER_EXT_REF = {
    iedName: "iedName",
    serviceType: "serviceType",
    ldInst: "ldInst",
    lnClass: "lnClass",
    lnInst: "lnInst",
    prefix: "prefix",
    doName: "doName",
    daName: "daName",
    srcLDInst: "srcLDInst",
    srcPrefix: "srcPrefix",
    srcLNClass: "srcLNClass",
    srcCBName: "srcCBName"
} as const