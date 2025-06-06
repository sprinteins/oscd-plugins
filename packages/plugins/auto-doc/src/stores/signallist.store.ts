// SVELTE
import { get, writable } from "svelte/store";
// STORES
import { pluginStore, SignalType } from './index'
// TYPES
import type { 
    MessagePublisher, LogicalNodeInformation,
    DataObjectInformation, InvalditiesReport, MessagePublisherFilter, 
    PdfRowStructure, 
    MessageSubscriberFilter
} from './signallist.store.d'

import { MESSAGE_PUBLISHER } from "../constants";
import { queryDataSetForControl, queryDataTypeLeaf, queryFCDA, queryLDevice, queryLN, queryLNode } from "../utils";



//====== STORES ======//
const { xmlDocument } = pluginStore
const pdfRowValues = writable<PdfRowStructure[]>([])

interface TargetContext {
    ied: Element,
    accessPoint: Element,
    lDevice: Element,
    ln: Element,
    extRef: Element,
    invaliditiesReports: InvalditiesReport[]
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

function getSignalList(invaliditiesReports: InvalditiesReport[]): MessagePublisher[] {
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
            extRef: null!,
            invaliditiesReports
        }

        return handleIED(targetContext).flat();
    })
    .flat();

    const messagePublishers = contexts
        .filter(c => Boolean(c.sourceContext))
        .map(c => fillMessagePublisherData(c));
    return messagePublishers;
}

function fillMessagePublisherData(context: SourceTarget): MessagePublisher {
    const lNode = context.sourceContext?.lNode;
    const substation = lNode?.closest('Substation')?.getAttribute('name') ?? '';
    const voltageLevel = lNode?.closest('VoltageLevel')?.getAttribute('name') ?? '';
    const bay = lNode?.closest('Bay')?.getAttribute('name') ?? '';
    const targetIed = context.targetContext.ied;
    const targetIEDName = targetIed.getAttribute('name') ?? '';

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
        [MESSAGE_PUBLISHER.TargetIEDName]: targetIEDName,
        [MESSAGE_PUBLISHER.IEDName]: iedName,
        [MESSAGE_PUBLISHER.LogicalNodeInformation]: logicalNodeInformation,
        [MESSAGE_PUBLISHER.DataObjectInformation]: dataObjectInformation
    }
}

function getDataObjectInformation(context: SourceTarget): DataObjectInformation {
    const xmlDoc = get(xmlDocument);
    if (!xmlDoc) {
        throw new Error("XML Document is not defined");
    }

    const extRef = context.targetContext.extRef;
    const iedName = extRef.getAttribute('iedName') ?? '';
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
        context.targetContext.invaliditiesReports.push({
            IEDName: iedName,
            invalidities: `FCDA not found ${dataLdInst}, ${dataLnClass}, ${dataLnInst}, ${dataPrefix}`
        });
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
        context.targetContext.invaliditiesReports.push({
            IEDName: iedName,
            invalidities: `Could not find data type leaf for lnType ${lnType}, doName ${doName}, daName ${daName}`
        });
    }

    const cdc = dataTypeLeaf?.cdcs.join('.') ?? '';
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
        targetContext.invaliditiesReports.push({
            IEDName: iedName,
            invalidities: `Source IED ${iedName} not found`
        });
        return null;
    }

    const sourceLDevice = sourceIed.querySelector(`LDevice[inst="${ldInst}"]`);
    if (!sourceLDevice) {
        targetContext.invaliditiesReports.push({
            IEDName: iedName,
            invalidities: `Source LDevice ${ldInst} not found`
        });
        return null;
    }

    const sourceLN = sourceLDevice.querySelector(`:scope > LN0[lnClass="${lnClass}"], :scope > LN[lnClass="${lnClass}"]`);
    if (!sourceLN) {
        targetContext.invaliditiesReports.push({
            IEDName: iedName,
            invalidities: `Source LN ${lnClass} not found`
        });
        return null;
    }

    const serviceType = targetContext.extRef.getAttribute('serviceType');
    if (!serviceType) {
        targetContext.invaliditiesReports.push({
            IEDName: iedName,
            invalidities: `ExtRef is missing serviceType attribute`
        });
        return null;
    }

    const controlTag = serviceTypeToControl[serviceType as ServiceType];
    const control = sourceLN.querySelector(`${controlTag}[name="${cbName}"]`);
    if (!control) {
        targetContext.invaliditiesReports.push({
            IEDName: iedName,
            invalidities: `${controlTag} ${cbName} not found`
        });
        return null;
    }

    const dataSet = queryDataSetForControl(control);
    if (!dataSet) {
        targetContext.invaliditiesReports.push({
            IEDName: iedName,
            invalidities: `DataSet ${control.getAttribute('datSet')} not found`
        });
        return null;
    }

    const dataLdInst = extRef.getAttribute('ldInst') ?? '';
    const dataLnClass = extRef.getAttribute('lnClass') ?? '';
    const dataLnInst = extRef.getAttribute('lnInst') ?? '';
    const dataPrefix = extRef.getAttribute('prefix') ?? '';

    const sourceAccessPoint = sourceLDevice.closest('AccessPoint');

    if (!sourceAccessPoint) {
        targetContext.invaliditiesReports.push({
            IEDName: iedName,
            invalidities: `Source AccessPoint not found`
        });
        return null;
    }

    const dataLDevice = queryLDevice(sourceAccessPoint, dataLdInst);

    if (!dataLDevice) {
        targetContext.invaliditiesReports.push({
            IEDName: iedName,
            invalidities: `Data LDevice ${dataLdInst} not found`
        });
        return null;
    }

    const dataLn = queryLN(dataLDevice, dataLnClass, dataLnInst, dataPrefix)

    if (!dataLn) {
        targetContext.invaliditiesReports.push({
            IEDName: iedName,
            invalidities: `Data LN ${dataLnClass}, ${dataLnInst}, ${dataPrefix} not found`
        });
        return null;
    }

    const lNode = queryLNode(xmlDoc, iedName, dataLdInst, dataLnClass, dataLnInst, dataPrefix);
    if (!lNode) {
        targetContext.invaliditiesReports.push({
            IEDName: iedName,
            invalidities: `LNode ${iedName}, ${dataLdInst}, ${dataLnClass}, ${dataLnInst}, ${dataPrefix} not found`
        });
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
function getPublishingLogicalDevices(filter: MessagePublisherFilter = {}, subscriberFilter: MessageSubscriberFilter): { pdfRows: PdfRowStructure[], invaliditiesReports: InvalditiesReport[] } {
    const invaliditiesReports: InvalditiesReport[] = [];

    const messagePublishers = getSignalList(invaliditiesReports);

    const pdfRows = filterMessagePublishers(messagePublishers, filter);
    const groupedPdfRows = groupByPublisher(pdfRows);
    const filteredPdfRows = filterSubscriber(groupedPdfRows, subscriberFilter);
    const pdfRowWithSubscribers = setSubscriber(filteredPdfRows);

    return { pdfRows: pdfRowWithSubscribers, invaliditiesReports};
}

//==== PRIVATE ACTIONS
function setSubscriber(filteredPdfRows: PdfRowStructure[]): PdfRowStructure[] {
    return filteredPdfRows.map(r => {
        const gooseSubscribers = r.matchedSubscribers[SignalType.GOOSE].join(', ');
        const mmsSubscribers = r.matchedSubscribers[SignalType.MMS].join(', ');
        const svSubscribers = r.matchedSubscribers[SignalType.SV].join(', ');

        const matchedFilteredValuesForPdf = [ ...r.matchedFilteredValuesForPdf[0], gooseSubscribers, mmsSubscribers, svSubscribers ];

        return {
            ...r,
            matchedFilteredValuesForPdf: [ matchedFilteredValuesForPdf ]
        }
    });
}

function doesNameMatchFilter(name: string, filterText: string | undefined): boolean {
    if (!filterText) {
        return true;
    }

    return name.toLowerCase().includes(filterText.toLowerCase());
}

function filterSubscriber(pdfRows: PdfRowStructure[], filter: MessageSubscriberFilter): PdfRowStructure[] {
    const gooseFilter = filter[SignalType.GOOSE];
    const mmsFilter = filter[SignalType.MMS];
    const svFilter = filter[SignalType.SV];

    return pdfRows.map(pdfRow => {
        const gooseSubscribers = gooseFilter ? pdfRow.matchedSubscribers[SignalType.GOOSE].filter(s => doesNameMatchFilter(s, gooseFilter)) : pdfRow.matchedSubscribers[SignalType.GOOSE];
        const mmsSubscribers = mmsFilter ? pdfRow.matchedSubscribers[SignalType.MMS].filter(s => doesNameMatchFilter(s, mmsFilter)) : pdfRow.matchedSubscribers[SignalType.MMS];
        const svSubscribers = svFilter ? pdfRow.matchedSubscribers[SignalType.SV].filter(s => doesNameMatchFilter(s, svFilter)) : pdfRow.matchedSubscribers[SignalType.SV];

        return {
            ...pdfRow,
            matchedSubscribers: {
                [SignalType.GOOSE]: gooseSubscribers,
                [SignalType.MMS]: mmsSubscribers,
                [SignalType.SV]: svSubscribers,
            }
        };
    });
}

function getPublisherIdentifier(pdfRow: PdfRowStructure): string {
    const p = pdfRow.publisher;
    const lnInfo = p.logicalNodeInformation;
    const doInfo = p.dataObjectInformation;

    return `${p.IEDName}-${p.M_text}-${lnInfo.LogicalDeviceInstance}-${lnInfo.LogicalNodeClass}-${lnInfo.LogicalNodeInstance}-${lnInfo.LogicalNodePrefix}-${lnInfo.LogicalNodeType}-${doInfo.AttributeType}-${doInfo.CommonDataClass}-${doInfo.DataAttributeName}-${doInfo.DataObjectName}-${doInfo.FunctionalConstraint}`;
}

function groupByPublisher(pdfRows: PdfRowStructure[]): PdfRowStructure[] {
    const groupedPdfRows: PdfRowStructure[] = [];

    for (const pdfRow of pdfRows) {
        const publisherId = getPublisherIdentifier(pdfRow);

        const existingPublisher = groupedPdfRows.find(r => getPublisherIdentifier(r) === publisherId);

        if (existingPublisher) {
            const signalType = pdfRow.publisher.signalType as SignalType;
            const subscribers = existingPublisher.matchedSubscribers[signalType];
            subscribers.push(...pdfRow.matchedSubscribers[signalType]);
        } else {
            groupedPdfRows.push(pdfRow);
        }
    }

    return groupedPdfRows;
}

function filterMessagePublishers(messagePublishers: MessagePublisher[], filter: MessagePublisherFilter): PdfRowStructure[] {
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
            const signalType = publisher.signalType;
            const gooseSubscriber = [];
            const mmsSubscriber = [];
            const svSubscriber = [];

            if (signalType === SignalType.GOOSE) {
                gooseSubscriber.push(publisher.targetIEDName);
            } else if (signalType === SignalType.MMS) {
                mmsSubscriber.push(publisher.targetIEDName);
            } else if (signalType === SignalType.SV) {
                svSubscriber.push(publisher.targetIEDName);
            }

            allMessagePublishers.push(publisher);
            matchedValueAndCorrespondingPublisher.push({
                matchedFilteredValuesForPdf:[valuesMatched],
                publisher,
                matchedSubscribers: {
                    [SignalType.GOOSE]: gooseSubscriber,
                    [SignalType.MMS]: mmsSubscriber,
                    [SignalType.SV]: svSubscriber,
                }
            });
        }  
    }

    pdfRowValues.update(() => [...matchedValueAndCorrespondingPublisher]);
    return matchedValueAndCorrespondingPublisher;
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
        FunctionalConstraint: "dataObjectInformation.FunctionalConstraint"
    };

    const path = keyMap[key] || key;

    const value: string = path.split('.').reduce((pub, k) => (pub ? pub[k] : ""), publisher) as unknown as string;
    return value;
}

export const signallistStore = {
    getPublishingLogicalDevices,
    // Store for table pdf
    pdfRowValues
};
