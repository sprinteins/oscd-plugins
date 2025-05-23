import { SignalType } from "@/stores";

export const autoDocIdentifier = 'AUTO_DOC'

export function queryAutoDocElement(xmlDocument: Document): Element | null {
    return xmlDocument.documentElement.querySelector(`Private[type="${autoDocIdentifier}"]`)
}

export function queryDataSetForControl(control: Element): Element | null {
    const dataSetName = control.getAttribute('datSet');
    return control.parentElement?.querySelector(`:scope > DataSet[name="${dataSetName}"]`) ?? null;
}

export function queryLDevice(accessPoint: Element, inst: string): Element | null {
    return accessPoint.querySelector(
        `:scope > Server > LDevice[inst="${inst}"]`
    );
}

export function buildLNQuery(
    lnClass: string,
    inst: string,
    prefix: string | null
): string {
    if (lnClass === 'LLN0') {
        return `:scope > LN0[lnClass="${lnClass}"]`;
    }
    
    let lnQuery = `:scope > LN[lnClass="${lnClass}"][inst="${inst}"]`;
    
    if (prefix) {
        lnQuery += `[prefix="${prefix}"]`;
    } else {
        lnQuery += `:not([prefix]), ${lnQuery}[prefix=""]`;
    }
    
    return lnQuery;
}

export function queryLN(
    lDevice: Element,
    lnClass: string,
    inst: string,
    prefix: string | null
): Element | null {
    const query = buildLNQuery(lnClass, inst, prefix);
    return lDevice.querySelector(query);
}

export function queryLNode(doc: XMLDocument, iedName: string, ldInst: string, lnClass: string, lnInst: string, prefix: string): Element | null {
    return doc.querySelector(`SCL > Substation > VoltageLevel > Bay LNode[iedName="${iedName}"][ldInst="${ldInst}"][lnClass="${lnClass}"][lnInst="${lnInst}"][prefix="${prefix}"]`);
}

export function queryFCDA(dataSet: Element, ldInst: string, lnClass: string, lnInst: string, prefix: string): Element | null {
    let query = `FCDA[ldInst="${ldInst}"][lnClass="${lnClass}"]`;
    
    if (lnClass !== 'LLN0') {
        query += `[lnInst="${lnInst}"][prefix="${prefix}"]`;
    }
    
    return dataSet.querySelector(query);
}


interface DataTypeLeaf {
    doLeaf: Element,
    daLeaf: Element | null,
    cdcs: string[],
    dataAttributeType: string | null
}

export function queryDataTypeLeaf(
    dataTypeTemplates: Element,
    lnType: string,
    doSegments: string[],
    daSegments: string[]
): DataTypeLeaf | null {
    const lNodeType = dataTypeTemplates.querySelector(
        `LNodeType[id="${lnType}"]`
    );
    if (!lNodeType) {
        return null;
    }
    
    const cdcs: string[] = [];
    let doLeaf = lNodeType;
    
    for (const doSegement of doSegments) {
        const dataObject = doLeaf.querySelector(
            `DO[name="${doSegement}"], SDO[name="${doSegement}"]`
        );
        if (!dataObject) {
            return null;
        }
        
        const doType = dataObject.getAttribute('type');
        if (!doType) {
            return null;
        }
        
        const doTypeElement = dataTypeTemplates.querySelector(
            `DOType[id="${doType}"]`
        );
        if (!doTypeElement) {
            return null;
        }

        const cdc = doTypeElement.getAttribute('cdc');
        if (cdc) {
            cdcs.push(cdc);
        }
        
        doLeaf = doTypeElement;
    }

    let daLeaf: Element | null = null;
    let dataAttributeType: string | null = null;

    for (const [index, daSegment] of daSegments.entries()) {
        const leaf = (daLeaf ?? doLeaf) as Element;
        const dataAttribute = leaf.querySelector(
            `DA[name="${daSegment}"], BDA[name="${daSegment}"]`
        );
        if (!dataAttribute) {
            return null;
        }
        
        const isLastEntry = index === daSegments.length - 1;
        if (isLastEntry) {
            dataAttributeType = dataAttribute?.getAttribute('bType') ?? null;

            // Do not search for type, because last entry is a leaf node and should be basic type
            break;
        }
        
        const daType = dataAttribute.getAttribute('type');
        if (!daType) {
            return null;
        }
        
        const daTypeElement = dataTypeTemplates.querySelector(
            `DAType[id="${daType}"]`
        );
        if (!daTypeElement) {
            return null;
        }
        
        daLeaf = daTypeElement;
    }
    
    return {
        doLeaf,
        daLeaf,
        cdcs,
        dataAttributeType
    };
}
