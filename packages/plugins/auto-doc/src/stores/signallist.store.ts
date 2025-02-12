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
    const DOIs = ln.querySelectorAll('DOI');
    for (const DOI of DOIs) {

        const doiName = DOI.getAttribute('name') || '';
        if(doName !== doiName) continue;

        const DAIs = DOI.querySelectorAll('DAI');
        for (const DAI of DAIs) {
            const desc = DAI.getAttribute('desc') || '';
            if (desc !== '') {
                const IEDName = ied.getAttribute('name') || '';
                const logicalNodeInofrmation: LogicalNodeInformation = {
                    IEDName,
                    LogicalDeviceInstance: ldInst,
                    LogicalNodePrefix: prefix,
                    LogicalNodeClass: lnClass,
                    LogicalNodeInstance: lnInst,
                    LogicalNodeType: ln.getAttribute('lnType') || ''
                };

                const LNodeType = findLNodeType(logicalNodeInofrmation.LogicalNodeType, dataTypeTemplates, IEDName, logicalNodeInofrmation, invaliditiesReports);
                if (!LNodeType) continue;

                const DO = findDO(doName, LNodeType, IEDName, logicalNodeInofrmation, invaliditiesReports);
                if (!DO) continue;

                const DOtypeId = DO.getAttribute('type') || '';
                const DOtype = findDOType(DOtypeId, dataTypeTemplates, IEDName, logicalNodeInofrmation, invaliditiesReports);
                if (!DOtype) continue;

                const daName = DAI.getAttribute('name') || '';
                const commonDataClass = DOtype.getAttribute('cdc') || '';
                const DA = findDA(daName, DOtype, IEDName, logicalNodeInofrmation, invaliditiesReports);
                if (!DA) continue;

                const attributeType = DA.getAttribute('bType') || '';

                const dataObjectInformation: DataObjectInformation = {
                    DataObjectName: doName,
                    DataAttributeName: daName,
                    CommonDataClass: commonDataClass,
                    AttributeType: attributeType,
                    FunctionalConstraint: fc
                };

                const isDuplicate = messagePublishers.some(publisher =>
                    publisher.M_text === desc &&
                    publisher.IEDName === IEDName &&
                    publisher.logicalNodeInofrmation.LogicalDeviceInstance === ldInst &&
                    publisher.logicalNodeInofrmation.LogicalNodePrefix === prefix &&
                    publisher.logicalNodeInofrmation.LogicalNodeClass === lnClass &&
                    publisher.logicalNodeInofrmation.LogicalNodeInstance === lnInst &&
                    publisher.logicalNodeInofrmation.LogicalNodeType === logicalNodeInofrmation.LogicalNodeType &&
                    publisher.dataObjectInformation.DataObjectName === doName &&
                    publisher.dataObjectInformation.DataAttributeName === daName &&
                    publisher.dataObjectInformation.CommonDataClass === commonDataClass &&
                    publisher.dataObjectInformation.AttributeType === attributeType &&
                    publisher.dataObjectInformation.FunctionalConstraint === fc
                );
                if (!isDuplicate) {
                    messagePublishers.push({ M_text: desc, signalType, IEDName, logicalNodeInofrmation, dataObjectInformation });
                }
            }
        }
    }
}

function findLNodeType(logicalNodeType: string, dataTypeTemplates: Element, IEDName: string, logicalNodeInofrmation: LogicalNodeInformation, invaliditiesReports: InvalditiesReport[]): Element | null {
    const LNodeType = dataTypeTemplates.querySelector(`LNodeType[id="${logicalNodeType}"]`);
    if (!LNodeType) {
        invaliditiesReports.push({ IEDName, LogicalNodeInformation: logicalNodeInofrmation, invalidities: [`LNodeType with id ${logicalNodeType} not found in DataTypeTemplates`] });
    }
    return LNodeType;
}

function findDO(doName: string, LNodeType: Element, IEDName: string, logicalNodeInofrmation: LogicalNodeInformation, invaliditiesReports: InvalditiesReport[]): Element | null {
    const DO = LNodeType.querySelector(`DO[name="${doName}"]`);
    if (!DO) {
        invaliditiesReports.push({ IEDName, LogicalNodeInformation: logicalNodeInofrmation, invalidities: [`DO with name ${doName} not found in LNodeType with id ${logicalNodeInofrmation.LogicalNodeType}`] });
    }
    return DO;
}

function findDOType(DOtypeId: string, dataTypeTemplates: Element, IEDName: string, logicalNodeInofrmation: LogicalNodeInformation, invaliditiesReports: InvalditiesReport[]): Element | null {
    const DOtype = dataTypeTemplates.querySelector(`DOType[id="${DOtypeId}"]`);
    if (!DOtype) {
        invaliditiesReports.push({ IEDName, LogicalNodeInformation: logicalNodeInofrmation, invalidities: [`DOType with id ${DOtypeId} not found in DataTypeTemplates`] });
    }
    return DOtype;
}

function findDA(daName: string, DOtype: Element, IEDName: string, logicalNodeInofrmation: LogicalNodeInformation, invaliditiesReports: InvalditiesReport[]): Element | null {
    const DA = DOtype.querySelector(`DA[name="${daName}"]`);
    if (!DA) {
        invaliditiesReports.push({ IEDName, LogicalNodeInformation: logicalNodeInofrmation, invalidities: [`DA with name ${daName} not found in DOType with id ${DOtype.getAttribute('id')}`] });
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
                IDEName: ied.getAttribute('name') || '',
                ExtRef: {
                    iedName: extRef.getAttribute('iedName') || '',
                    serviceType: SignalType[extRef.getAttribute('serviceType') as keyof typeof SignalType] || SignalType.UNKNOWN as SignalType,
                    ldInst: extRef.getAttribute('ldInst') || '',
                    lnClass: extRef.getAttribute('lnClass') || '',
                    lnInst: extRef.getAttribute('lnInst') || '',
                    prefix: extRef.getAttribute('prefix') || '',
                    doName: extRef.getAttribute('doName') || '',
                    daName: extRef.getAttribute('daName') || '',
                    srcLDInst: extRef.getAttribute('srcLDInst') || '',
                    srcPrefix: extRef.getAttribute('srcPrefix') || '',
                    srcLNClass: extRef.getAttribute('srcLNClass') || '',
                    srcCBName: extRef.getAttribute('srcCBName') || ''
                }
            };
            messageSubscribers.push(subscriber);
        }
    }
}

function matchesExtRef(extRef: Element, messagePublisher: MessagePublisher): boolean {
    return extRef.getAttribute('iedName') === messagePublisher.IEDName &&
        extRef.getAttribute('ldInst') === messagePublisher.logicalNodeInofrmation.LogicalDeviceInstance &&
        extRef.getAttribute('lnClass') === messagePublisher.logicalNodeInofrmation.LogicalNodeClass &&
        extRef.getAttribute('lnInst') === messagePublisher.logicalNodeInofrmation.LogicalNodeInstance &&
        extRef.getAttribute('prefix') === messagePublisher.logicalNodeInofrmation.LogicalNodePrefix &&
        extRef.getAttribute('doName') === messagePublisher.dataObjectInformation.DataObjectName &&
        extRef.getAttribute('daName') === messagePublisher.dataObjectInformation.DataAttributeName;
}



function filterMessagePublishers(messagePublishers: MessagePublisher[], filter: MessagePublisherFilter):  MessagePublisher[] {
    const matchedValueAndCorrespondingPublisher : PdfRowStructure [] = [];
    const allMessagePublishers: MessagePublisher[] = [];

    for (const publisher of messagePublishers) {
        const valuesMatched = [];
        let allFiltersMatch = true;

        if (filter.M_text !== undefined) {
            if (publisher.M_text.toLocaleLowerCase().includes(filter.M_text.toLocaleLowerCase()) || (filter.M_text.trim() === '')) {
                valuesMatched.push(publisher.M_text);
            } else {
                allFiltersMatch = false;
            }
        }
        if (filter.IEDName !== undefined) {
            if (publisher.IEDName.toLocaleLowerCase().includes(filter.IEDName.toLocaleLowerCase()) || (filter.IEDName.trim() === '')) {
                valuesMatched.push(publisher.IEDName);
            } else {
                allFiltersMatch = false;
            }
        }
        // LNs check
        if (filter.LogicalNodeIEDName !== undefined) {
            if (publisher.logicalNodeInofrmation.IEDName.toLocaleLowerCase().includes(filter.LogicalNodeIEDName.toLocaleLowerCase()) || (filter.LogicalNodeIEDName.trim() === '')) {
                valuesMatched.push(publisher.logicalNodeInofrmation.IEDName);
            } else {
                allFiltersMatch = false;
            }
        }
        if (filter.LogicalDeviceInstance !== undefined) {
            if (publisher.logicalNodeInofrmation.LogicalDeviceInstance.toLocaleLowerCase().includes(filter.LogicalDeviceInstance.toLocaleLowerCase()) || (filter.LogicalDeviceInstance.trim() === '')) {
                valuesMatched.push(publisher.logicalNodeInofrmation.LogicalDeviceInstance);
            } else {
                allFiltersMatch = false;
            }
        }
        if (filter.LogicalNodePrefix !== undefined) {
            if (publisher.logicalNodeInofrmation.LogicalNodePrefix.toLocaleLowerCase().includes(filter.LogicalNodePrefix.toLocaleLowerCase()) || (filter.LogicalNodePrefix.trim() === '')) {
                valuesMatched.push(publisher.logicalNodeInofrmation.LogicalNodePrefix);
            } else {
                allFiltersMatch = false;
            }
        }
        if (filter.LogicalNodeClass !== undefined) {
            if (publisher.logicalNodeInofrmation.LogicalNodeClass.toLocaleLowerCase().includes(filter.LogicalNodeClass.toLocaleLowerCase()) || (filter.LogicalNodeClass.trim() === '')) {
                valuesMatched.push(publisher.logicalNodeInofrmation.LogicalNodeClass);
            } else {
                allFiltersMatch = false;
            }
        }
        if (filter.LogicalNodeInstance !== undefined) {
            if (publisher.logicalNodeInofrmation.LogicalNodeInstance.toLocaleLowerCase().includes(filter.LogicalNodeInstance.toLocaleLowerCase()) || (filter.LogicalNodeInstance.trim() === '')) {
                valuesMatched.push(publisher.logicalNodeInofrmation.LogicalNodeInstance);
            } else {
                allFiltersMatch = false;
            }
        }
        if (filter.LogicalNodeType !== undefined) {
            if (publisher.logicalNodeInofrmation.LogicalNodeType.toLocaleLowerCase().includes(filter.LogicalNodeType.toLocaleLowerCase()) || (filter.LogicalNodeType.trim() === '')) {
                valuesMatched.push(publisher.logicalNodeInofrmation.LogicalNodeType);
            } else {
                allFiltersMatch = false;
            }
        }

        // Dos check
        if (filter.DataObjectName !== undefined) {
            if (publisher.dataObjectInformation.DataObjectName.toLowerCase().includes(filter.DataObjectName.toLowerCase()) || (filter.DataObjectName.trim() === '')) {
                valuesMatched.push(publisher.dataObjectInformation.DataObjectName);
            } else {
                allFiltersMatch = false;
            }
        }
        if (filter.DataAttributeName !== undefined) {
            if (publisher.dataObjectInformation.DataAttributeName.toLowerCase().includes(filter.DataAttributeName.toLowerCase()) || (filter.DataAttributeName.trim() === '')) {
                valuesMatched.push(publisher.dataObjectInformation.DataAttributeName);
            } else {
                allFiltersMatch = false;
            }
        }
        if (filter.CommonDataClass !== undefined) {
            if (publisher.dataObjectInformation.CommonDataClass.toLowerCase().includes(filter.CommonDataClass.toLowerCase()) || (filter.CommonDataClass.trim() === '')) {
                valuesMatched.push(publisher.dataObjectInformation.CommonDataClass);
            } else {
                allFiltersMatch = false;
            }
        }
        if (filter.AttributeType !== undefined) {
            if (publisher.dataObjectInformation.AttributeType.toLowerCase().includes(filter.AttributeType.toLowerCase()) || (filter.AttributeType.trim() === '')) {
                valuesMatched.push(publisher.dataObjectInformation.AttributeType);
            } else {
                allFiltersMatch = false;
            }
        }
        if (filter.FunctionalConstraint !== undefined) {
            if (publisher.dataObjectInformation.FunctionalConstraint.toLowerCase().includes(filter.FunctionalConstraint.toLowerCase()) || (filter.FunctionalConstraint.trim() === '')) {
                valuesMatched.push(publisher.dataObjectInformation.FunctionalConstraint);
            } else {
                allFiltersMatch = false;
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

function filterMessageSubscribers(messageSubscribers: MessageSubscriber[], filter: MessageSubscriberFilter): MessageSubscriberAndPdfContent {

    const allMessageSubscribers: MessageSubscriber[] = [];

    for (const subscriber of messageSubscribers) {
        const valuesMatched = [];
        let allFiltersMatch = true;
        if(filter.IDEName !== undefined) {
            if (subscriber.IDEName.toLocaleLowerCase().includes(filter.IDEName.toLocaleLowerCase()) || (filter.IDEName.trim() === '')) {
                valuesMatched.push(subscriber.IDEName);
            } else {
                allFiltersMatch = false;
            }
        }
        if(filter.serviceType !== undefined) {
            if (subscriber.ExtRef.serviceType.toLocaleLowerCase().includes(filter.serviceType.toLocaleLowerCase()) || (filter.serviceType.trim() === '')) {
                setSubscriberIedNameInCorrespondingPublisher(subscriber, get(pdfRowValues))
            } else {
                allFiltersMatch = false;
            }
        }
        if(allFiltersMatch) {
            allMessageSubscribers.push(subscriber);
        } 
    }
        
    return {matchedRows: get(pdfRowValues), subscribers: allMessageSubscribers};
}

function setSubscriberIedNameInCorrespondingPublisher(subscriber: MessageSubscriber, pdfRows: PdfRowStructure[]): void {
    for (const pdfRow of pdfRows) {
        if(isSubscriberMatch(pdfRow, subscriber)){
            const existingValues = pdfRow.matchedFilteredValuesForPdf[0];
            pdfRow.matchedSubscribers.push(subscriber.IDEName)

            const concatenatedSubscribers = pdfRow.matchedSubscribers.join(', ')
            existingValues.push(concatenatedSubscribers)
        }
    }   
    pdfRowValues.update(() => [...pdfRows])
}

function isSubscriberMatch(pdfRow: PdfRowStructure, subscriber: MessageSubscriber) {
    return (pdfRow.publisher.IEDName === subscriber.ExtRef.iedName &&
        pdfRow.publisher.logicalNodeInofrmation.LogicalDeviceInstance === subscriber.ExtRef.ldInst &&
        pdfRow.publisher.logicalNodeInofrmation.LogicalNodeClass === subscriber.ExtRef.lnClass &&
        pdfRow.publisher.logicalNodeInofrmation.LogicalNodeInstance === subscriber.ExtRef.lnInst &&
        pdfRow.publisher.logicalNodeInofrmation.LogicalNodePrefix === subscriber.ExtRef.prefix &&
        pdfRow.publisher.dataObjectInformation.DataObjectName === subscriber.ExtRef.doName &&
        pdfRow.publisher.dataObjectInformation.DataAttributeName === subscriber.ExtRef.daName);
}

export const signallistStore = {
    getSignallist,
    getPublishingLogicalDevices,
    getSubscribingLogicalDevices,
    // Store for table pdf
    pdfRowValues
};