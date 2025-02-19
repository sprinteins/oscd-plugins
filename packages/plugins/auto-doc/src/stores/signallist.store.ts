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



//====== STORES ======//
const { xmlDocument } = pluginStore
const pdfRowValues = writable<PdfRowStructure[]>([])


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
    const messagePublishers: MessagePublisher[] = [];
    const invaliditiesReports: InvalditiesReport[] = [];

    const xmlDoc = get(xmlDocument);
    if (!xmlDoc) {
        throw new Error("XML Document is not defined");
    }

    const dataTypeTemplates = xmlDoc.querySelector('DataTypeTemplates');
    if (!dataTypeTemplates) {
        throw new Error("DataTypeTemplates Element not found in XML Document");
    }

    const IEDs = xmlDoc.querySelectorAll('IED');
    for (const ied of IEDs) {
        processIEDForPublishers(ied, dataTypeTemplates, messagePublishers, invaliditiesReports);
    }

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
        processLDeviceForPublishers(lDevice, ied, dataTypeTemplates, messagePublishers, invaliditiesReports);
    }
}

function processLDeviceForPublishers(lDevice: Element, ied: Element, dataTypeTemplates: Element, messagePublishers: MessagePublisher[], invaliditiesReports: InvalditiesReport[]) {
    const lNode0 = lDevice.querySelector('LN0');
    if (!lNode0) return;

    const GSEControl = lNode0.querySelector('GSEControl');
    const ReportControl = lNode0.querySelector('ReportControl');
    if (!GSEControl && !ReportControl) return;
    const signalType = GSEControl ? SignalType.GOOSE : (ReportControl ? SignalType.MMS : SignalType.UNKNOWN);

    const dataSets = lNode0.querySelectorAll('DataSet');
    for (const dataSet of dataSets) {
        processDataSet(dataSet, lDevice, ied, dataTypeTemplates, signalType, messagePublishers, invaliditiesReports);
    }
}

function processDataSet(dataSet: Element, lDevice: Element, ied: Element, dataTypeTemplates: Element, signalType: SignalType, messagePublishers: MessagePublisher[], invaliditiesReports: InvalditiesReport[]) {
    const FCDAs = dataSet.querySelectorAll('FCDA');
    for (const FCDA of FCDAs) {
        processFCDA(FCDA, lDevice, ied, dataTypeTemplates, signalType, messagePublishers, invaliditiesReports);
    }
}

function processFCDA(FCDA: Element, lDevice: Element, ied: Element, dataTypeTemplates: Element, signalType: SignalType, messagePublishers: MessagePublisher[], invaliditiesReports: InvalditiesReport[]) {
    const ldInst = lDevice.getAttribute('inst') || '';
    const prefix = FCDA.getAttribute('prefix') || '';
    const lnClass = FCDA.getAttribute('lnClass') || '';
    const lnInst = FCDA.getAttribute('lnInst') || '';
    const doName = FCDA.getAttribute('doName') || '';
    const daName = FCDA.getAttribute('daName') || '';
    const fc = FCDA.getAttribute('fc') || '';

    const lNodes = lDevice.querySelectorAll(`LN[inst="${lnInst}"][lnClass="${lnClass}"][prefix="${prefix}"]`);
    for (const ln of lNodes) {
        processLN(ln, ldInst, prefix, lnClass, lnInst, doName, daName, fc, ied, dataTypeTemplates, signalType, messagePublishers, invaliditiesReports);
    }
}

function processLN(ln: Element, ldInst: string, prefix: string, lnClass: string, lnInst: string, doName: string, daName:string, fc: string, ied: Element, dataTypeTemplates: Element, signalType: SignalType, messagePublishers: MessagePublisher[], invaliditiesReports: InvalditiesReport[]) {
    const xmlDoc = get(xmlDocument);
    if (!xmlDoc) {
        throw new Error("XML Document is not defined");
    }
    const substation = xmlDoc.querySelector('Substation');
    const substationName = substation ? substation.getAttribute('name') || '' : '';
    const voltageLevel = substation?.querySelector("VoltageLevel")?.getAttribute('name')|| '';

    const DOIs = ln.querySelectorAll('DOI');
    for (const DOI of DOIs) {

        const doiName = DOI.getAttribute('name') || '';
        if(doName !== doiName) continue;

        const DAIs = DOI.querySelectorAll('DAI');
        for (const DAI of DAIs) {
            const desc = DAI.getAttribute('desc') || '';
            if (desc !== '') {
                const IEDName = ied.getAttribute('name') || '';
                const logicalNodeInformation: LogicalNodeInformation = {
                    [MESSAGE_PUBLISHER.IEDName]: IEDName,
                    [MESSAGE_PUBLISHER.LogicalDeviceInstance]: ldInst,
                    [MESSAGE_PUBLISHER.LogicalNodePrefix]: prefix,
                    [MESSAGE_PUBLISHER.LogicalNodeClass]: lnClass,
                    [MESSAGE_PUBLISHER.LogicalNodeInstance]: lnInst,
                    [MESSAGE_PUBLISHER.LogicalNodeType]: ln.getAttribute('lnType') || ''
                };

                const LNodeType = findLNodeType(logicalNodeInformation.LogicalNodeType, dataTypeTemplates, IEDName, logicalNodeInformation, invaliditiesReports);
                if (!LNodeType) continue;

                const DO = findDO(doName, LNodeType, IEDName, logicalNodeInformation, invaliditiesReports);
                if (!DO) continue;

                const DOtypeId = DO.getAttribute('type') || '';
                const DOtype = findDOType(DOtypeId, dataTypeTemplates, IEDName, logicalNodeInformation, invaliditiesReports);
                if (!DOtype) continue;

                const daName = DAI.getAttribute('name') || '';
                const commonDataClass = DOtype.getAttribute('cdc') || '';
                const DA = findDA(daName, DOtype, IEDName, logicalNodeInformation, invaliditiesReports);
                if (!DA) continue;

                const attributeType = DA.getAttribute('bType') || '';

                const dataObjectInformation: DataObjectInformation = {
                    [MESSAGE_PUBLISHER.DataObjectName]: doName,
                    [MESSAGE_PUBLISHER.DataAttributeName]: daName,
                    [MESSAGE_PUBLISHER.CommonDataClass]: commonDataClass,
                    [MESSAGE_PUBLISHER.AttributeType]: attributeType,
                    [MESSAGE_PUBLISHER.FunctionalConstraint]: fc,
                };

                const isDuplicate = messagePublishers.some(publisher =>
                    publisher.M_text === desc &&
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
                if (!isDuplicate) {
                    messagePublishers.push({ 
                        [MESSAGE_PUBLISHER.UW]: substationName, 
                        [MESSAGE_PUBLISHER.VoltageLevel]: voltageLevel,
                        [MESSAGE_PUBLISHER.M_text]: desc, 
                        [MESSAGE_PUBLISHER.SignalType]: signalType, 
                        [MESSAGE_PUBLISHER.IEDName]: IEDName, 
                        [MESSAGE_PUBLISHER.LogicalNodeInformation]: logicalNodeInformation,
                        [MESSAGE_PUBLISHER.DataObjectInformation]: dataObjectInformation,
                         
                    });
                }
            }
        }
    }
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

    const allMessageSubscribers: MessageSubscriber[] = [];
    for (const subscriber of messageSubscribers) {

        const matchesIEDName = !filter.IEDName || 
            subscriber.IEDName.toLocaleLowerCase().includes(filter.IEDName.toLocaleLowerCase()) ||
            (filter.IEDName.trim() === '');

        const matchesServiceType = !filter.serviceType ||
            subscriber.ExtRef.serviceType.toLocaleLowerCase().includes(filter.serviceType.toLocaleLowerCase()) ||
            (filter.serviceType.trim() === '');

        if(matchesIEDName && matchesServiceType){
            allMessageSubscribers.push(subscriber);
            setSubscriberIedNameInCorrespondingPublisher(subscriber, get(pdfRowValues))
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