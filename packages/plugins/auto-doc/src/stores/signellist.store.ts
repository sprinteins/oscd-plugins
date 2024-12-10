// SVELTE
import { get } from "svelte/store";
// STORES
import { pluginStore } from './index'


//====== STORES ======//
const { xmlDocument } = pluginStore

//==== PUBLIC ACTIONS
function getSignallist(){
    const xmlDoc = get(xmlDocument);
    if (!xmlDoc) {
        throw new Error("XML Document is not defined");
    }

}

enum SignalType {
    GOOSE = 'GOOSE',
    MMS = 'MMS',
    SVM = 'SVM',
    UNKOWN = 'UNKOWN',
}

interface MessagePublisher{
    M_text: string;
    signalType: SignalType;
    IEDName: string;
    logicalNodeInofrmation: LogicalNodeInformation;
    dataObjectInformation: DataObjectInformation;
}

interface MessageSubscriber{
    IDEName: string;
    ExtRef: ExtRef
}
interface ExtRef {
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
// <LNode> Element in SCD
interface LogicalNodeInformation {
    IEDName: string; // Reference to the iedName name in the SCD
    LogicalDeviceInstance: string; // Reference to the ldInst in the SCD
    LogicalNodePrefix: string; // Reference to the prefix in the SCD
    LogicalNodeClass: string; // Reference to the lnClass in the SCD
    LogicalNodeInstance: string; // Reference to the lnInst in the SCD
    LogicalNodeType:string; // Reference to the lnType in the SCD
}

// <DO> Element in SCD
interface DataObjectInformation{
    DataObjectName: string;
    DataAttributeName: string;
    CommonDataClass: string;
    AttributeType: string;
    FunctionalConstraint: string;
}

interface InvalditiesReport{
    IEDName: string;
    LogicalNodeInformation: LogicalNodeInformation;
    invalidities: string[];
}

function findPublishingLogicalDevices(): { messagePublishers: MessagePublisher[], invaliditiesReports: InvalditiesReport[] }
{
    const messagePublishers: MessagePublisher[] = [];
    const invaliditiesReports: InvalditiesReport[] = [];

    const xmlDoc = get(xmlDocument);
    if (!xmlDoc) {
        throw new Error("XML Document is not defined");
    }
    const dataTypeTemplates = xmlDoc.querySelector('DataTypeTemplates');
    if (!dataTypeTemplates){
        throw new Error("DataTypeTemplates Element not found in XML Document");
    }
    const IEDs = xmlDoc.querySelectorAll('IED')
    for (const ied of IEDs){
        // loop over all AccessPoint in IED
        const accessPoints = ied.querySelectorAll('AccessPoint');
        for (const accessPoint of accessPoints){
            const LDevices = accessPoint.querySelectorAll('LDevice');
            for (const lDevice of LDevices){
                // check if the lDevice has a LN0 child with GSEControl child
                const lNode0 = lDevice.querySelector('LN0');
                if (lNode0){
                    const GSEControl = lNode0.querySelector('GSEControl');
                    const ReportControl = lNode0.querySelector('ReportControl');
                    if (GSEControl || ReportControl){
                        // save SignalType
                        let signalType: SignalType;
                        if (GSEControl){
                            signalType = SignalType.GOOSE;
                        } else if (ReportControl){
                            signalType = SignalType.MMS;
                        } else {
                            signalType = SignalType.UNKOWN;
                        }

                        //navigate to DataSet in lNode0
                        const dataSets = lNode0.querySelectorAll('DataSet');
                        for (const dataSet of dataSets){
                            const FCDAs = dataSet.querySelectorAll('FCDA');
                            for (const FCDA of FCDAs){
                                //extract linINst, doName, daName from FCDA
                                const ldInst = lDevice.getAttribute('inst') || '';
                                const prefix = FCDA.getAttribute('prefix') || '';
                                const lnClass = FCDA.getAttribute('lnClass') || '';
                                const lnInst = FCDA.getAttribute('lnInst') || '';
                                const doName = FCDA.getAttribute('doName') || '';
                                const fc = FCDA.getAttribute('fc') || '';

                                // iterate over all LN under LDevice with inst=lnInst and lnClass=lnClass and prefix=prefix
                                const lNodes = lDevice.querySelectorAll(`LN[inst="${lnInst}"][lnClass="${lnClass}"][prefix="${prefix}"]`);
                                for(const ln of lNodes){
                                    // check if there is a DOI Element with a DAI element and the DAI has a desc != ""
                                    const DOIs = ln.querySelectorAll('DOI');
                                    for (const DOI of DOIs){
                                        const DAIs = DOI.querySelectorAll('DAI');
                                        for (const DAI of DAIs){
                                            const desc = DAI.getAttribute('desc') || '';
                                            if (desc !== ''){
                                                const IEDName = ied.getAttribute('name') || '';
                                                const logicalNodeInofrmation: LogicalNodeInformation = {
                                                    IEDName,
                                                    LogicalDeviceInstance: ldInst,
                                                    LogicalNodePrefix: prefix,
                                                    LogicalNodeClass: lnClass,
                                                    LogicalNodeInstance: lnInst,
                                                    LogicalNodeType: ln.getAttribute('lnType') || ''
                                                }
                                                // search in DataTypeTemplates for LNodeType with id == logicalNodeInofrmation.LogicalNodeType
                                                const LNodeType = dataTypeTemplates.querySelector(`LNodeType[id="${logicalNodeInofrmation.LogicalNodeType}"]`);
                                                if (!LNodeType){
                                                    invaliditiesReports.push({IEDName, LogicalNodeInformation: logicalNodeInofrmation, invalidities: [`LNodeType with id ${logicalNodeInofrmation.LogicalNodeType} not found in DataTypeTemplates`]});
                                                    continue;
                                                }
                                                // search in LNodeType for DO with name == doName
                                                const DO = LNodeType.querySelector(`DO[name="${doName}"]`);
                                                if (!DO){
                                                    invaliditiesReports.push({IEDName, LogicalNodeInformation: logicalNodeInofrmation, invalidities: [`DO with name ${doName} not found in LNodeType with id ${logicalNodeInofrmation.LogicalNodeType}`]});
                                                    continue;
                                                }
                                                const DOtypeId = DO.getAttribute('type') || '';
                                                // search in DataTypeTemplates for DOType with id == DOtype
                                                const DOtype = dataTypeTemplates.querySelector(`DOType[id="${DOtypeId}"]`);
                                                if (!DOtype){
                                                    invaliditiesReports.push({IEDName, LogicalNodeInformation: logicalNodeInofrmation, invalidities: [`DOType with id ${DOtypeId} not found in DataTypeTemplates`]});
                                                    continue;
                                                }

                                                const daName = DAI.getAttribute('name') || '';
                                                const commonDataClass = DOtype.getAttribute('cdc') || '';
                                                // search in DOType for DA with name == daName
                                                const DA = DOtype.querySelector(`DA[name="${daName}"]`);
                                                if (!DA){
                                                    invaliditiesReports.push({IEDName, LogicalNodeInformation: logicalNodeInofrmation, invalidities: [`DA with name ${daName} not found in DOType with id ${DOtypeId}`]});
                                                    continue;
                                                }
                                                const attributeType = DA.getAttribute('btype') || '';

                                                const dataObjectInformation: DataObjectInformation = {
                                                    DataObjectName: doName,
                                                    DataAttributeName: daName,
                                                    CommonDataClass: commonDataClass,
                                                    AttributeType: attributeType,
                                                    FunctionalConstraint: fc
                                                }
                                                messagePublishers.push({M_text: desc, signalType, IEDName, logicalNodeInofrmation, dataObjectInformation});
                                            }
                                        }
                                    }
                                }
                            }
                        }                  
                    }
                }
            }
        }
    }
    return { messagePublishers, invaliditiesReports };
}

function findSubscribingLogicalDevices(messagePublishers: MessagePublisher[]): { messageSubscribers: MessageSubscriber[], invaliditiesReports: InvalditiesReport[] }
{
    const xmlDoc = get(xmlDocument);
    if (!xmlDoc) {
        throw new Error("XML Document is not defined");
    }

    const messageSubscribers: MessageSubscriber[] = [];
    const invaliditiesReports: InvalditiesReport[] = [];

    for (const messagePublisher of messagePublishers){
        // search for all IED exept the one that is publishing
        const IEDs = Array.from(xmlDoc.querySelectorAll('IED')).filter(ied => ied.getAttribute('name') !== messagePublisher.IEDName);
        for (const ied of IEDs){
            // loop over all AccessPoint in IED
            const accessPoints = ied.querySelectorAll('AccessPoint');
            for (const accessPoint of accessPoints){
                //loop over Server in AccessPoint
                const LDevices = accessPoint.querySelectorAll('LDevice');
                for (const lDevice of LDevices){
                    //get the LN0 element
                    const lNode0 = lDevice.querySelector('LN0');
                    // get all Inputs in LN0
                    if(!lNode0){
                        invaliditiesReports.push({IEDName: ied.getAttribute('name') || '', LogicalNodeInformation: {IEDName: '', LogicalDeviceInstance: '', LogicalNodePrefix: '', LogicalNodeClass: '', LogicalNodeInstance: '', LogicalNodeType: ''}, invalidities: ['LN0 Element not found']});
                        continue;
                    }
                    const Inputs = lNode0.querySelectorAll('Inputs');
                    for (const input of Inputs){
                        // get all ExtRef in Inputs
                        const ExtRefs = input.querySelectorAll('ExtRef');
                        for (const extRef of ExtRefs){
                            // if extRef has iedName == messagePublisher.IEDName 
                            if (extRef.getAttribute('iedName') === messagePublisher.IEDName 
                            && extRef.getAttribute('ldInst') === messagePublisher.logicalNodeInofrmation.LogicalDeviceInstance 
                            && extRef.getAttribute('lnClass') === messagePublisher.logicalNodeInofrmation.LogicalNodeClass 
                            && extRef.getAttribute('lnInst') === messagePublisher.logicalNodeInofrmation.LogicalNodeInstance 
                            && extRef.getAttribute('prefix') === messagePublisher.logicalNodeInofrmation.LogicalNodePrefix 
                            && extRef.getAttribute('doName') === messagePublisher.dataObjectInformation.DataObjectName 
                            && extRef.getAttribute('daName') === messagePublisher.dataObjectInformation.DataAttributeName){

                                console.log(extRef.getAttribute('serviceType'));
                                const subscriber: MessageSubscriber = {
                                    IDEName: ied.getAttribute('name') || '',
                                    ExtRef: {
                                        iedName: extRef.getAttribute('iedName') || '',
                                        serviceType: SignalType[extRef.getAttribute('serviceType') as keyof typeof SignalType] || SignalType.UNKOWN as SignalType,
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
                                }
                                messageSubscribers.push(subscriber);
                            }
                        }
                    }
                }
            }   
        }

    }

    return { messageSubscribers, invaliditiesReports };
}




export const signallistStore = {
    // actions
    findPublishingLogicalDevices,
    findSubscribingLogicalDevices,
};