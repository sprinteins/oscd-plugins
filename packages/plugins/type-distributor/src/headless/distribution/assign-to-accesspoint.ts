import { pluginGlobalStore } from "@oscd-plugins/core-ui-svelte";
import type { AssignableTemplates, LNodeTemplate } from "../types";
import { bayStore } from "../stores";
import { createAndDispatchEditEvent } from "@oscd-plugins/core-api/plugin/v1";
import type { Insert, SetAttributes } from '@openscd/oscd-api'
import {v4 as uuidv4} from 'uuid';

// we need identifier for IED and AccessPoint
export function assignToAccessPoint(element: AssignableTemplates, iedName: string, apName: string): void {
    const doc = pluginGlobalStore.xmlDocument
    if (!doc) {
        throw new Error("No XML document loaded");
    }
    const host = pluginGlobalStore.host;
    if (!host) {
        throw new Error("No host available in pluginGlobalStore");
    }
    const bayUuid = bayStore.selectedBayUuid;
    if (!bayUuid) {
        throw new Error("No bay selected");
    }

    // Get the AP to assign to
    const accessPoint = doc.querySelector(`IED[name="${iedName}"] > AccessPoint[name="${apName}"]`);
    if (!accessPoint) {
        throw new Error(`AccessPoint ${apName} not found in IED ${iedName}`);
    }

    // get the LNodes to assign
    let lnodesToAssign: Array<LNodeTemplate> = [];

    if ('lnodes' in element) {
        // it's a function or equipment function template
        lnodesToAssign = element.lnodes.map(lnode => ({
            lnClass: lnode.lnClass,
            lnInst: lnode.lnInst,
            lnType: lnode.lnType,
            uuid: lnode.uuid,
        }));
    }
    else {
        // it's a single LNode template
        lnodesToAssign.push({
            lnClass: element.lnClass,
            lnInst: element.lnInst,
            lnType: element.lnType,
            uuid: element.uuid,
        });
    }

    const bayElement = doc.querySelector(`Bay[name="${bayStore.selectedBay}"]`);
    if (!bayElement) {
        throw new Error(`Bay ${bayStore.selectedBay} not found`);
    }

    let insertElement: Element = bayElement

    let referenceElement = doc.querySelector(`Bay[name="${bayStore.selectedBay}"] > ConnectivityNode`);

    let node = null;

    // if equipement function
    if ('type' in element) {
        // element is the Template of an ConductingEquipment

        // we get the ConductingEquipment in the SCD
        const conductingEquipment = doc.querySelector(`Bay[name="${bayStore.selectedBay}"] > ConductingEquipment[type="${element.type}"]`);
    
        if (!conductingEquipment) {
            throw new Error(`ConductingEquipment of type ${element.type} not found in selected Bay`);
        }

        insertElement = conductingEquipment;
        referenceElement = null;

        // we get the template UUID from the ssd to set the templateUuid attribute in SCD
    
        // we get the originUuid from the SCD
        const originUuid = conductingEquipment.getAttribute("uuid");
        if (!originUuid) {
            throw new Error(`Origin UUID for ConductingEquipment with templateUuid ${conductingEquipment.getAttribute("uuid")} not found`);
        }

        const edit: SetAttributes = {
            element: insertElement,
            attributes: {
                templateUuid: bayUuid,
                originUuid: originUuid,
                uuid: uuidv4()
            }
        }
    
        createAndDispatchEditEvent({
            host: host,
            edit: edit // need new API here
        });

        // Think i stopped here
        node = doc.createElement("EqFunction");
        node.setAttribute("name", "")
    }

    // add function
    const edit: Insert = {
        parent: insertElement,
        node: 
    }

    // Assign LNodes to AccessPoint

    // Copy uses DataType Templates as needed

}
