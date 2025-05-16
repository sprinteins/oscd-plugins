// SVELTE
import { get, writable } from "svelte/store";
// STORES
import { pluginStore } from './index'
// TYPES
import type { 
    MessagePublisher, MessageSubscriber, LogicalNodeInformation,
    DataObjectInformation, InvalditiesReport, MessagePublisherFilter, 
    MessageSubscriberFilter, MessageSubscriberAndPdfContent, PdfRowStructure 
} from './signallist.store.d'

import { SignalType } from './signallist.store.d'

import { MESSAGE_PUBLISHER,  MESSAGE_SUBSCRIBER,  SUBSCRIBER_EXT_REF } from "../constants";
import { buildLNQuery, queryDataSetForControl, queryDataTypeLeaf, queryExtRef, queryFCDA, queryLDevice, queryLN, queryLNode } from "@/utils";



//====== STORES ======//
const { xmlDocument } = pluginStore
const pdfRowValues = writable<PdfRowStructure[]>([])


//==== new attempt, i cant take all this terrible code anymore

interface TargetContext {
    ied: Element,
    accessPoint: Element,
    lDevice: Element,
    ln: Element,
    extRef: Element
}

interface SourceContext {
    ied: Element,
    lDevice: Element,
    ln: Element,
    control: Element,
    dataSet: Element,
    dataLn: Element,
    lNode: Element
}

enum ServiceType {
    GOOSE = 'GOOSE',
    Report = 'Report',
    SMV = 'SMV'
}

const serviceTypeToControl: { [key in ServiceType]: string } = {
    [ServiceType.GOOSE]: 'GSEControl',
    [ServiceType.Report]: 'ReportControl',
    [ServiceType.SMV]: 'SampledValueControl'
}

interface SourceTarget {
    sourceContext: SourceContext | null;
    targetContext: TargetContext;
}

function getSignalList2(): MessagePublisher[] {
    const xmlDoc = get(xmlDocument);
    if (!xmlDoc) {
        throw new Error("XML Document is not defined");
    }

    const ieds = xmlDoc.querySelectorAll('IED');

    const contexts = Array.from(ieds).map(ied => {
        const targetContext: TargetContext = {
            ied: ied,
            accessPoint: null!,
            lDevice: null!,
            ln: null!,
            extRef: null!
        }

        return handleIED(targetContext).flat();
    })
    .flat();

    const messagePublishers = contexts.map(c => fillMessagePublisherData(c));
    return messagePublishers;
}

function fillMessagePublisherData(context: SourceTarget): MessagePublisher {
    const lNode = context.sourceContext?.lNode!;
    const substation = lNode.closest('Substation')?.getAttribute('name') ?? '';
    const voltageLevel = lNode.closest('VoltageLevel')?.getAttribute('name') ?? '';
    const bay = lNode.closest('Bay')?.getAttribute('name') ?? '';

    const extRef = context.targetContext.extRef!;
    const mText = extRef.getAttribute('desc') ?? '';
    const signalType = extRef.getAttribute('serviceType') ?? '';
    const iedName = extRef.getAttribute('iedName') ?? '';
    const dataLDInst = extRef.getAttribute('ldInst') ?? '';
    const dataLnClass = extRef.getAttribute('lnClass') ?? '';
    const dataLnInst = extRef.getAttribute('lnInst') ?? '';
    const dataLnPrefix = extRef.getAttribute('prefix') ?? '';

    const dataLn = context.sourceContext!.dataLn!;
    const dataLnType = dataLn.getAttribute('lnType') ?? '';

    const logicalNodeInformation: LogicalNodeInformation = {
        [MESSAGE_PUBLISHER.IEDName]: iedName,
        [MESSAGE_PUBLISHER.LogicalDeviceInstance]: dataLDInst,
        [MESSAGE_PUBLISHER.LogicalNodePrefix]: dataLnPrefix,
        [MESSAGE_PUBLISHER.LogicalNodeClass]: dataLnClass,
        [MESSAGE_PUBLISHER.LogicalNodeInstance]: dataLnInst,
        [MESSAGE_PUBLISHER.LogicalNodeType]: dataLnType
    };

    const dataObjectInformation = getDataObjectInformation(context);

    return {
        [MESSAGE_PUBLISHER.UW]: substation,
        [MESSAGE_PUBLISHER.VoltageLevel]: voltageLevel,
        [MESSAGE_PUBLISHER.Bay]: bay,
        [MESSAGE_PUBLISHER.M_text]: mText,
        [MESSAGE_PUBLISHER.SignalType]: signalType,
        [MESSAGE_PUBLISHER.IEDName]: iedName,
        [MESSAGE_PUBLISHER.LogicalNodeInformation]: logicalNodeInformation,
        [MESSAGE_PUBLISHER.DataObjectInformation]: dataObjectInformation
    }
}

function getDataObjectInformation(context: SourceTarget): DataObjectInformation {
    // TODO: FN -> FCDA
    // TODO: Traverse DataObject
    // TODO: CDC: Each DOType -> ABC.DEF
    // data Attribute: Leaf DA Type
    const xmlDoc = get(xmlDocument);
    if (!xmlDoc) {
        throw new Error("XML Document is not defined");
    }

    const extRef = context.targetContext.extRef;
    const doName = extRef.getAttribute('doName') ?? '';
    const daName = extRef.getAttribute('daName') ?? '';

    const dataLdInst = extRef.getAttribute('ldInst') ?? '';
    const dataLnClass = extRef.getAttribute('lnClass') ?? '';
    const dataLnInst = extRef.getAttribute('lnInst') ?? '';
    const dataPrefix = extRef.getAttribute('prefix') ?? '';

    const dataSet = context.sourceContext!.dataSet;

    const fcda = queryFCDA(dataSet, dataLdInst, dataLnClass, dataLnInst, dataPrefix);
    const fc = fcda?.getAttribute('fc') ?? '';

    if (!fcda) {
        console.log(`FCDA not found ${dataLdInst}, ${dataLnClass}, ${dataLnInst}, ${dataPrefix}`);
    }

    const dataTypeTemplates = xmlDoc.querySelector('SCL > DataTypeTemplates');
    if (!dataTypeTemplates) {
        throw new Error('DataTypeTemplates not found');
    }

    const dataLn = context.sourceContext!.dataLn;
    const lnType = dataLn.getAttribute('lnType') ?? '';
    const doSegments = doName.split('.');
    const daSegments = daName ? daName.split('.') : [];

    const dataTypeLeaf = queryDataTypeLeaf(dataTypeTemplates, lnType, doSegments, daSegments);
    if (!dataTypeLeaf) {
        console.log(`Could not find data type leaf for lnType ${lnType}, doName ${doName}, daName ${daName}`);
    }

    const cdc = dataTypeLeaf?.cdcs.join('.') ?? '';
    console.log(dataTypeLeaf?.daLeaf);
    const attributeType = dataTypeLeaf?.dataAttributeType ?? '';

    return {
        [MESSAGE_PUBLISHER.DataObjectName]: doName,
        [MESSAGE_PUBLISHER.DataAttributeName]: daName,
        [MESSAGE_PUBLISHER.CommonDataClass]: cdc,
        [MESSAGE_PUBLISHER.AttributeType]: attributeType,
        [MESSAGE_PUBLISHER.FunctionalConstraint]: fc
    };
}

function handleIED(targetContext: TargetContext) {
    const accessPoints = targetContext.ied.querySelectorAll(':scope > AccessPoint');

    return Array.from(accessPoints).map(accessPoint => {
        const newTargetContext = {
            ...targetContext,
            accessPoint
        };

        return handleAccessPoint(newTargetContext).flat();
    });
}

function handleAccessPoint(targetContext: TargetContext) {
    const lDevices = targetContext.accessPoint.querySelectorAll(':scope > Server > LDevice');

    return Array.from(lDevices).map(lDevice => {
        const newTargetContext = {
            ...targetContext,
            lDevice
        };

        return handleLDevice(newTargetContext).flat();
    });
}

function handleLDevice(targetContext: TargetContext) {
    const lns = targetContext.lDevice.querySelectorAll(':scope > LN');

    return Array.from(lns).map(ln => {
        const newTargetContext = {
            ...targetContext,
            ln
        };

        return handleLn(newTargetContext).flat();
    });
}

function handleLn(targetContext: TargetContext) {
    const extRefs = targetContext.ln.querySelectorAll(':scope > Inputs > ExtRef');

    return Array.from(extRefs)
        .map(extRef => {
            const newTargetContext = {
                ...targetContext,
                extRef
            };

            return handleExtRef(newTargetContext);
        });
}

function handleExtRef(targetContext: TargetContext) {
    const sourceContext = getSourceContext(targetContext);

    return {
        sourceContext,
        targetContext
    };
}

function getSourceContext(targetContext: TargetContext): SourceContext | null {
    const xmlDoc = get(xmlDocument);
    if (!xmlDoc) {
        throw new Error("XML Document is not defined");
    }

    const extRef = targetContext.extRef;
    const iedName = extRef.getAttribute('iedName') ?? '';
    const ldInst = extRef.getAttribute('srcLDInst');
    const lnClass = extRef.getAttribute('srcLNClass');
    const cbName = extRef.getAttribute('srcCBName');

    const sourceIed = xmlDoc.querySelector(`IED[name="${iedName}"]`);
    if (!sourceIed) {
        console.log(`Source IED ${iedName} not found`);
        return null;
    }

    // TODO: Do we need to consider accesspoint?
    const sourceLDevice = sourceIed.querySelector(`LDevice[inst="${ldInst}"]`);
    if (!sourceLDevice) {
        console.log(`Source LDevice ${ldInst} not found`);
        return null;
    }

    const sourceLN = sourceLDevice.querySelector(`:scope > LN0[lnClass="${lnClass}"], :scope > LN[lnClass="${lnClass}"]`);
    if (!sourceLN) {
        console.log(`Source LN ${lnClass} not found`);
        return null;
    }

    const serviceType = targetContext.extRef.getAttribute('serviceType');
    if (!serviceType) {
        console.log(`ExtRef is missing serviceType attribute`);
        return null;
    }

    const controlTag = serviceTypeToControl[serviceType as ServiceType];
    const control = sourceLN.querySelector(`${controlTag}[name="${cbName}"]`);
    if (!control) {
        console.log(`${controlTag} ${cbName} not found`);
        return null;
    }

    const dataSet = queryDataSetForControl(control);
    if (!dataSet) {
        console.log(`DataSet ${control.getAttribute('datSet')} not found`);
        return null;
    }

    const dataLdInst = extRef.getAttribute('ldInst') ?? '';
    const dataLnClass = extRef.getAttribute('lnClass') ?? '';
    const dataLnInst = extRef.getAttribute('lnInst') ?? '';
    const dataPrefix = extRef.getAttribute('prefix') ?? '';

    const sourceAccessPoint = sourceLDevice.closest('AccessPoint');

    if (!sourceAccessPoint) {
        console.log(`Source AccessPoint not found`);
        return null;
    }

    const dataLDevice = queryLDevice(sourceAccessPoint, dataLdInst);

    if (!dataLDevice) {
        console.log(`Data LDevice ${dataLdInst} not found`);
        return null;
    }

    const dataLn = queryLN(dataLDevice, dataLnClass, dataLnInst, dataPrefix)

    if (!dataLn) {
        console.log(`Data LN ${dataLnClass}, ${dataLnInst}, ${dataPrefix} not found`);
        return null;
    }

    const lNode = queryLNode(xmlDoc, iedName, dataLdInst, dataLnClass, dataLnInst, dataPrefix);
    if (!lNode) {
        console.log(`LNode ${iedName}, ${dataLdInst}, ${dataLnClass}, ${dataLnInst}, ${dataPrefix} not found`);
        return null;
    }

    return {
        ied: sourceIed,
        lDevice: sourceLDevice,
        ln: sourceLN,
        control,
        dataSet,
        dataLn,
        lNode
    };
}


//==== PUBLIC ACTIONS
function getSignallist() {
    const xmlDoc = get(xmlDocument);
    if (!xmlDoc) {
        throw new Error("XML Document is not defined");
    }

    const { messagePublishers, invaliditiesReports: publishingInvalidities } = getPublishingLogicalDevices();
    const { messageSubscribers, invaliditiesReports: subscribingInvalidities } = getSubscribingLogicalDevices(messagePublishers);

    return {
        messagePublishers,
        messageSubscribers,
        invaliditiesReports: [...publishingInvalidities, ...subscribingInvalidities]
    };
}

function getPublishingLogicalDevices(filter: MessagePublisherFilter = {}): { messagePublishers: MessagePublisher[], invaliditiesReports: InvalditiesReport[] } {
    const invaliditiesReports: InvalditiesReport[] = [];

    const messagePublishers = getSignalList2();
    console.log(messagePublishers);

    const filteredMessagePublishers = filterMessagePublishers(messagePublishers, filter);

    return { messagePublishers: filteredMessagePublishers, invaliditiesReports};
}

function getSubscribingLogicalDevices(messagePublishers: MessagePublisher[], filter: MessageSubscriberFilter = {}): { messageSubscribers: MessageSubscriber[], invaliditiesReports: InvalditiesReport[], matchedRows: PdfRowStructure[] } {
    const xmlDoc = get(xmlDocument);
    if (!xmlDoc) {
        throw new Error("XML Document is not defined");
    }

    const messageSubscribers: MessageSubscriber[] = [];
    const invaliditiesReports: InvalditiesReport[] = [];

    for (const messagePublisher of messagePublishers) {
        const IEDs = Array.from(xmlDoc.querySelectorAll('IED')).filter(ied => ied.getAttribute('name') !== messagePublisher.IEDName);
       
        for (const ied of IEDs) {
            processIEDForSubscribers(ied, messagePublisher, messageSubscribers, invaliditiesReports);
        }
    }

    const {subscribers:filteredMessageSubscribers, matchedRows} = filterMessageSubscribers(messageSubscribers, filter);

    return { messageSubscribers: filteredMessageSubscribers, invaliditiesReports, matchedRows };
}



//==== PRIVATE ACTIONS
function processIEDForPublishers(ied: Element, dataTypeTemplates: Element, messagePublishers: MessagePublisher[], invaliditiesReports: InvalditiesReport[]) {
    const accessPoints = ied.querySelectorAll('AccessPoint');
    for (const accessPoint of accessPoints) {
        processAccessPointForPublishers(accessPoint, ied, dataTypeTemplates, messagePublishers, invaliditiesReports);
    }
}

function processAccessPointForPublishers(accessPoint: Element, ied: Element, dataTypeTemplates: Element, messagePublishers: MessagePublisher[], invaliditiesReports: InvalditiesReport[]) {
    const LDevices = accessPoint.querySelectorAll('LDevice');
    for (const lDevice of LDevices) {
        processLDeviceForPublishers(accessPoint, lDevice, ied, dataTypeTemplates, messagePublishers, invaliditiesReports);
    }
}

function processLDeviceForPublishers(accessPoint: Element, lDevice: Element, ied: Element, dataTypeTemplates: Element, messagePublishers: MessagePublisher[], invaliditiesReports: InvalditiesReport[]) {
    const lNodes = lDevice.querySelectorAll('LN0, LN');
    for (const ln of lNodes) {
        processLNForPublishers(accessPoint, ln, lDevice, ied, dataTypeTemplates, messagePublishers, invaliditiesReports);
    }
}

function processLNForPublishers(accessPoint: Element, ln: Element, lDevice: Element, ied: Element, dataTypeTemplates: Element, messagePublishers: MessagePublisher[], invaliditiesReports: InvalditiesReport[]) {
    const gseControls = ln.querySelectorAll('GSEControl');
    const reportControls = ln.querySelectorAll('ReportControl');
    const sampledValueControls = ln.querySelectorAll('SampledValueControl');

    // Source info: CBName,  ?? LD Inst, LN Class
    // iedName, ServiceType

    for (const gseControl of gseControls) {
        const dataSet = queryDataSetForControl(gseControl);

        if (!dataSet) {
            continue;
        }

        processDataSet(dataSet, gseControl, accessPoint, lDevice, ied, dataTypeTemplates, SignalType.GOOSE, messagePublishers, invaliditiesReports);
    }

    for (const reportControl of reportControls) {
        const dataSet = queryDataSetForControl(reportControl);

        if (!dataSet) {
            continue;
        }

        processDataSet(dataSet, reportControl, accessPoint, lDevice, ied, dataTypeTemplates, SignalType.MMS, messagePublishers, invaliditiesReports);
    }

    for (const sampleValueControl of sampledValueControls) {
        const dataSet = queryDataSetForControl(sampleValueControl);

        if (!dataSet) {
            continue;
        }

        processDataSet(dataSet, sampleValueControl, accessPoint, lDevice, ied, dataTypeTemplates, SignalType.SV, messagePublishers, invaliditiesReports);
    }
}

function processDataSet(dataSet: Element, control: Element, accessPoint: Element, lDevice: Element, ied: Element, dataTypeTemplates: Element, signalType: SignalType, messagePublishers: MessagePublisher[], invaliditiesReports: InvalditiesReport[]) {
    const FCDAs = dataSet.querySelectorAll('FCDA');
    for (const FCDA of FCDAs) {
        processFCDA(FCDA, control, accessPoint, lDevice, ied, dataTypeTemplates, signalType, messagePublishers, invaliditiesReports);
    }
}

function processFCDA(FCDA: Element, control: Element, accessPoint: Element, lDevice: Element, ied: Element, dataTypeTemplates: Element, signalType: SignalType, messagePublishers: MessagePublisher[], invaliditiesReports: InvalditiesReport[]) {
    const ldInst = FCDA.getAttribute('ldInst') || '';
    const prefix = FCDA.getAttribute('prefix') || '';
    const lnClass = FCDA.getAttribute('lnClass') || '';
    const lnInst = FCDA.getAttribute('lnInst') || '';
    const doName = FCDA.getAttribute('doName') || '';
    const daName = FCDA.getAttribute('daName') || '';
    const fc = FCDA.getAttribute('fc') || '';

    const targetLDevice = queryLDevice(accessPoint, ldInst);
    if (!targetLDevice) {
        // TODO: Remove console
        console.log('Target LDevice not found');
        return;
    }

    const targetLN = queryLN(targetLDevice, lnClass, lnInst, prefix);
    if (!targetLN) {
        // TODO: Remove console
        console.log('Target LN not found');
        return;
    }

    processLN(targetLN, control, ldInst, prefix, lnClass, lnInst, doName, daName, fc, ied, dataTypeTemplates, signalType, messagePublishers, invaliditiesReports);
}

function processLN(targetLn: Element, control: Element, ldInst: string, prefix: string, lnClass: string, lnInst: string, doName: string, daName:string, fc: string, ied: Element, dataTypeTemplates: Element, signalType: SignalType, messagePublishers: MessagePublisher[], invaliditiesReports: InvalditiesReport[]) {
    console.log(`Processing LN: lnClass: ${lnClass}, lnInst: ${lnInst}, prefix: ${prefix}`)
    const xmlDoc = get(xmlDocument);
    if (!xmlDoc) {
        throw new Error("XML Document is not defined");
    }
    const substation = xmlDoc.querySelector('Substation');
    const substationName = substation?.getAttribute('name') ?? '';
    const IEDName = ied.getAttribute('name') || '';

    const logicalNodeInformation: LogicalNodeInformation = {
        [MESSAGE_PUBLISHER.IEDName]: IEDName,
        [MESSAGE_PUBLISHER.LogicalDeviceInstance]: ldInst,
        [MESSAGE_PUBLISHER.LogicalNodePrefix]: prefix,
        [MESSAGE_PUBLISHER.LogicalNodeClass]: lnClass,
        [MESSAGE_PUBLISHER.LogicalNodeInstance]: lnInst,
        [MESSAGE_PUBLISHER.LogicalNodeType]: targetLn.getAttribute('lnType') || ''
    };

    const LNodeType = findLNodeType(logicalNodeInformation.LogicalNodeType, dataTypeTemplates, IEDName, logicalNodeInformation, invaliditiesReports);
    if (!LNodeType) {
        console.log(`LNodeType not found ${logicalNodeInformation.LogicalNodeType}`)
        return;
    }

    const DO = findDO(doName, LNodeType, IEDName, logicalNodeInformation, invaliditiesReports);
    if (!DO) {
        console.log(`DO not found ${doName}`)
        return;
    }

    const DOtypeId = DO.getAttribute('type') || '';
    const DOtype = findDOType(DOtypeId, dataTypeTemplates, IEDName, logicalNodeInformation, invaliditiesReports);
    if (!DOtype) {
        console.log(`DOType not found ${DOtypeId}`)
        return;
    }

    const commonDataClass = DOtype.getAttribute('cdc') || '';
    const DA = findDA(daName, DOtype, IEDName, logicalNodeInformation, invaliditiesReports);
    if (!DA) {
        console.log(`DA not found ${daName}`)
    }

    const attributeType = DA?.getAttribute('bType') || '';

    const dataObjectInformation: DataObjectInformation = {
        [MESSAGE_PUBLISHER.DataObjectName]: doName,
        [MESSAGE_PUBLISHER.DataAttributeName]: daName,
        [MESSAGE_PUBLISHER.CommonDataClass]: commonDataClass,
        [MESSAGE_PUBLISHER.AttributeType]: attributeType,
        [MESSAGE_PUBLISHER.FunctionalConstraint]: fc,
    };

    // TODO: ExtRef -> desc
    // which iedName?
    const extRef = queryExtRef(targetLn, IEDName, control.getAttribute('name') || '', signalType);

    if (!extRef) {
        // console.log('ExtRef not found');
    }

    const mText = extRef?.getAttribute('desc') ?? '';

    const isDuplicate = messagePublishers.some(publisher =>
        publisher.M_text === mText &&
        publisher.IEDName === IEDName &&
        publisher.logicalNodeInformation.LogicalDeviceInstance === ldInst &&
        publisher.logicalNodeInformation.LogicalNodePrefix === prefix &&
        publisher.logicalNodeInformation.LogicalNodeClass === lnClass &&
        publisher.logicalNodeInformation.LogicalNodeInstance === lnInst &&
        publisher.logicalNodeInformation.LogicalNodeType === logicalNodeInformation.LogicalNodeType &&
        publisher.dataObjectInformation.DataObjectName === doName &&
        publisher.dataObjectInformation.DataAttributeName === daName &&
        publisher.dataObjectInformation.CommonDataClass === commonDataClass &&
        publisher.dataObjectInformation.AttributeType === attributeType &&
        publisher.dataObjectInformation.FunctionalConstraint === fc
    );

    if (isDuplicate) {
        return;
    }

    let voltageLevelName = ''
    let bayName = ''

    const voltageLevel = substation?.querySelectorAll("VoltageLevel");

    if(voltageLevel){
        
        for (const vl of voltageLevel) {
           const bays = vl.querySelectorAll("Bay");
           for (const bay of bays) {

            const lNodes = bay.querySelectorAll("LNode");

            for(const ln of lNodes){
                const lnIedName = ln.getAttribute("iedName")
                if(lnIedName === IEDName ){
                    bayName = bay.getAttribute("name") || ''
                    voltageLevelName = vl.getAttribute("name") || ''
                }
            }
            
           }
        }
    }
    messagePublishers.push({
        [MESSAGE_PUBLISHER.UW]: substationName, 
        [MESSAGE_PUBLISHER.VoltageLevel]: voltageLevelName,
        [MESSAGE_PUBLISHER.Bay]: bayName,
        [MESSAGE_PUBLISHER.M_text]: mText, 
        [MESSAGE_PUBLISHER.SignalType]: signalType, 
        [MESSAGE_PUBLISHER.IEDName]: IEDName, 
        [MESSAGE_PUBLISHER.LogicalNodeInformation]: logicalNodeInformation,
        [MESSAGE_PUBLISHER.DataObjectInformation]: dataObjectInformation,
         
    });
}

function findLNodeType(logicalNodeType: string, dataTypeTemplates: Element, IEDName: string, logicalNodeInformation: LogicalNodeInformation, invaliditiesReports: InvalditiesReport[]): Element | null {
    const LNodeType = dataTypeTemplates.querySelector(`LNodeType[id="${logicalNodeType}"]`);
    if (!LNodeType) {
        invaliditiesReports.push({ IEDName, LogicalNodeInformation: logicalNodeInformation, invalidities: [`LNodeType with id ${logicalNodeType} not found in DataTypeTemplates`] });
    }
    return LNodeType;
}

function findDO(doName: string, LNodeType: Element, IEDName: string, logicalNodeInformation: LogicalNodeInformation, invaliditiesReports: InvalditiesReport[]): Element | null {
    const DO = LNodeType.querySelector(`DO[name="${doName}"]`);
    if (!DO) {
        invaliditiesReports.push({ IEDName, LogicalNodeInformation: logicalNodeInformation, invalidities: [`DO with name ${doName} not found in LNodeType with id ${logicalNodeInformation.LogicalNodeType}`] });
    }
    return DO;
}

function findDOType(DOtypeId: string, dataTypeTemplates: Element, IEDName: string, logicalNodeInformation: LogicalNodeInformation, invaliditiesReports: InvalditiesReport[]): Element | null {
    const DOtype = dataTypeTemplates.querySelector(`DOType[id="${DOtypeId}"]`);
    if (!DOtype) {
        invaliditiesReports.push({ IEDName, LogicalNodeInformation: logicalNodeInformation, invalidities: [`DOType with id ${DOtypeId} not found in DataTypeTemplates`] });
    }
    return DOtype;
}

function findDA(daName: string, DOtype: Element, IEDName: string, logicalNodeInformation: LogicalNodeInformation, invaliditiesReports: InvalditiesReport[]): Element | null {
    const DA = DOtype.querySelector(`DA[name="${daName}"]`);
    if (!DA) {
        invaliditiesReports.push({ IEDName, LogicalNodeInformation: logicalNodeInformation, invalidities: [`DA with name ${daName} not found in DOType with id ${DOtype.getAttribute('id')}`] });
    }
    return DA;
}

function processIEDForSubscribers(ied: Element, messagePublisher: MessagePublisher, messageSubscribers: MessageSubscriber[], invaliditiesReports: InvalditiesReport[]) {
    const accessPoints = ied.querySelectorAll('AccessPoint');
    for (const accessPoint of accessPoints) {
        processAccessPointForSubscribers(accessPoint, ied, messagePublisher, messageSubscribers, invaliditiesReports);
    }
}

function processAccessPointForSubscribers(accessPoint: Element, ied: Element, messagePublisher: MessagePublisher, messageSubscribers: MessageSubscriber[], invaliditiesReports: InvalditiesReport[]) {
    const LDevices = accessPoint.querySelectorAll('LDevice');
    for (const lDevice of LDevices) {
        processLDeviceForSubscribers(lDevice, ied, messagePublisher, messageSubscribers, invaliditiesReports);
    }
}

function processLDeviceForSubscribers(lDevice: Element, ied: Element, messagePublisher: MessagePublisher, messageSubscribers: MessageSubscriber[], invaliditiesReports: InvalditiesReport[]) {
    const lNode0 = lDevice.querySelector('LN0');
    if (!lNode0) {
        return;
    }

    const Inputs = lNode0.querySelectorAll('Inputs');
    for (const input of Inputs) {
        processInputs(input, ied, messagePublisher, messageSubscribers, invaliditiesReports);
    }
}

function processInputs(input: Element, ied: Element, messagePublisher: MessagePublisher, messageSubscribers: MessageSubscriber[], invaliditiesReports: InvalditiesReport[]) {
    const ExtRefs = input.querySelectorAll('ExtRef');
    for (const extRef of ExtRefs) {
        if (matchesExtRef(extRef, messagePublisher)) {
            const subscriber: MessageSubscriber = {
                [MESSAGE_SUBSCRIBER.IEDName]: ied.getAttribute('name') || '',
                [MESSAGE_SUBSCRIBER.ExtRef]: {
                    [SUBSCRIBER_EXT_REF.iedName]: extRef.getAttribute('iedName') || '',
                    [SUBSCRIBER_EXT_REF.serviceType]: SignalType[extRef.getAttribute('serviceType') as keyof typeof SignalType] || SignalType.UNKNOWN as SignalType,
                    [SUBSCRIBER_EXT_REF.ldInst]: extRef.getAttribute('ldInst') || '',
                    [SUBSCRIBER_EXT_REF.lnClass]: extRef.getAttribute('lnClass') || '',
                    [SUBSCRIBER_EXT_REF.lnInst]: extRef.getAttribute('lnInst') || '',
                    [SUBSCRIBER_EXT_REF.prefix]: extRef.getAttribute('prefix') || '',
                    [SUBSCRIBER_EXT_REF.doName]: extRef.getAttribute('doName') || '',
                    [SUBSCRIBER_EXT_REF.daName]: extRef.getAttribute('daName') || '',
                    [SUBSCRIBER_EXT_REF.srcLDInst]: extRef.getAttribute('srcLDInst') || '',
                    [SUBSCRIBER_EXT_REF.srcPrefix]: extRef.getAttribute('srcPrefix') || '',
                    [SUBSCRIBER_EXT_REF.srcLNClass]: extRef.getAttribute('srcLNClass') || '',
                    [SUBSCRIBER_EXT_REF.srcCBName]: extRef.getAttribute('srcCBName') || '',
                }
            };
            console.log('adding subscriber', subscriber);
            messageSubscribers.push(subscriber);
        }
    }
}

function matchesExtRef(extRef: Element, messagePublisher: MessagePublisher): boolean {
    return extRef.getAttribute('iedName') === messagePublisher.IEDName &&
        extRef.getAttribute('ldInst') === messagePublisher.logicalNodeInformation.LogicalDeviceInstance &&
        extRef.getAttribute('lnClass') === messagePublisher.logicalNodeInformation.LogicalNodeClass &&
        extRef.getAttribute('lnInst') === messagePublisher.logicalNodeInformation.LogicalNodeInstance &&
        extRef.getAttribute('prefix') === messagePublisher.logicalNodeInformation.LogicalNodePrefix &&
        extRef.getAttribute('doName') === messagePublisher.dataObjectInformation.DataObjectName &&
        extRef.getAttribute('daName') === messagePublisher.dataObjectInformation.DataAttributeName;
}



function filterMessagePublishers(messagePublishers: MessagePublisher[], filter: MessagePublisherFilter):  MessagePublisher[] {
    const matchedValueAndCorrespondingPublisher : PdfRowStructure [] = [];
    const allMessagePublishers: MessagePublisher[] = [];

    const filterSearchKeys = Object.keys(filter) as (keyof MessagePublisherFilter)[];
    for (const publisher of messagePublishers) {
        const valuesMatched = [];
        let allFiltersMatch = true;


        for(const searKey of filterSearchKeys) {
            const substringSearch = filter[searKey];
            if(substringSearch !== undefined) {
                const publisherValueFromSearchKey : string = getValueFromNestedProperty(publisher, searKey);
                if(publisherValueFromSearchKey.toLocaleLowerCase().includes(substringSearch.toLocaleLowerCase()) || (substringSearch.trim() === '')){
                    valuesMatched.push(publisherValueFromSearchKey);
                }else{
                    allFiltersMatch = false
                }
            }       
        }

        if (allFiltersMatch) {
            allMessagePublishers.push(publisher);
            matchedValueAndCorrespondingPublisher.push({matchedFilteredValuesForPdf:[valuesMatched], publisher, matchedSubscribers: []})
        }  
    }
    pdfRowValues.update(() => [...matchedValueAndCorrespondingPublisher])
    return  allMessagePublishers
}

function getValueFromNestedProperty(publisher: MessagePublisher, key: keyof MessagePublisherFilter): string {
    const keyMap: Partial<Record<keyof MessagePublisherFilter, string>> = {
        LogicalNodeIEDName: "logicalNodeInformation.IEDName",
        LogicalDeviceInstance: "logicalNodeInformation.LogicalDeviceInstance",
        LogicalNodePrefix: "logicalNodeInformation.LogicalNodePrefix",
        LogicalNodeClass: "logicalNodeInformation.LogicalNodeClass",
        LogicalNodeInstance: "logicalNodeInformation.LogicalNodeInstance",
        LogicalNodeType: "logicalNodeInformation.LogicalNodeType",
        DataObjectName: "dataObjectInformation.DataObjectName",
        DataAttributeName: "dataObjectInformation.DataAttributeName",
        CommonDataClass: "dataObjectInformation.CommonDataClass",
        AttributeType: "dataObjectInformation.AttributeType",
        FunctionalConstraint: "dataObjectInformation.FunctionalConstraint",
    };

    const path = keyMap[key] || key;

    const value: string = path.split('.').reduce((pub, k) => (pub ? pub[k] : ""), publisher) as unknown as string;
    return value;
}

function filterMessageSubscribers(messageSubscribers: MessageSubscriber[], filter: MessageSubscriberFilter): MessageSubscriberAndPdfContent {
    const filterMessageTypes = Object.keys(filter) as (keyof MessageSubscriberFilter)[];


    const allMessageSubscribers: MessageSubscriber[] = [];

    for (const subscriber of messageSubscribers) {
        for(const messageType of filterMessageTypes) {
            const IEDNameSearch = filter[messageType];

            const matchesServiceType = messageType &&
            (subscriber.ExtRef.serviceType.toLocaleLowerCase().includes(messageType.toLocaleLowerCase()) ||
            (messageType.trim() === ''));            
            
            const matchesIEDName = !IEDNameSearch ||
            subscriber.IEDName.toLocaleLowerCase().includes(IEDNameSearch.toLocaleLowerCase()) ||
            (IEDNameSearch.trim() === '');
            
            if(matchesIEDName && matchesServiceType){
                allMessageSubscribers.push(subscriber);
                setSubscriberIedNameInCorrespondingPublisher(subscriber, get(pdfRowValues))
            }
        }
    }
        
    return {matchedRows: get(pdfRowValues), subscribers: allMessageSubscribers};
}

function setSubscriberIedNameInCorrespondingPublisher(subscriber: MessageSubscriber, pdfRows: PdfRowStructure[]): void {
    for (const pdfRow of pdfRows) {
        if(isSubscribedToCurrentPublisher(pdfRow, subscriber)){

            addUniqueSubscribersIEDName(pdfRow, subscriber.IEDName);
            updateMatchedFilteredValues(pdfRow);
        }
    }   
    pdfRowValues.update(() => [...pdfRows])
}

function isSubscribedToCurrentPublisher(pdfRow: PdfRowStructure, subscriber: MessageSubscriber) {
    return (pdfRow.publisher.IEDName === subscriber.ExtRef.iedName &&
        pdfRow.publisher.logicalNodeInformation.LogicalDeviceInstance === subscriber.ExtRef.ldInst &&
        pdfRow.publisher.logicalNodeInformation.LogicalNodeClass === subscriber.ExtRef.lnClass &&
        pdfRow.publisher.logicalNodeInformation.LogicalNodeInstance === subscriber.ExtRef.lnInst &&
        pdfRow.publisher.logicalNodeInformation.LogicalNodePrefix === subscriber.ExtRef.prefix &&
        pdfRow.publisher.dataObjectInformation.DataObjectName === subscriber.ExtRef.doName &&
        pdfRow.publisher.dataObjectInformation.DataAttributeName === subscriber.ExtRef.daName);
}

function addUniqueSubscribersIEDName(pdfRow: PdfRowStructure, subscriberName: string): void {
    if (!pdfRow.matchedSubscribers.includes(subscriberName)) {
        pdfRow.matchedSubscribers.push(subscriberName);
    }
}

function updateMatchedFilteredValues(pdfRow: PdfRowStructure): void {
    const concatenatedSubscribers = pdfRow.matchedSubscribers.join(', ');
    const existingValues = pdfRow.matchedFilteredValuesForPdf[0];

    if (existingValues.length > 0 && pdfRow.matchedSubscribers.includes(existingValues[existingValues.length - 1])) {
        existingValues[existingValues.length - 1] = concatenatedSubscribers;
    } else {
        existingValues.push(concatenatedSubscribers);
    }
}

export const signallistStore = {
    getSignallist,
    getPublishingLogicalDevices,
    getSubscribingLogicalDevices,
    // Store for table pdf
    pdfRowValues
};