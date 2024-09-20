import { SCDQueries, UCTypeDesigner } from "@oscd-plugins/core";
import type { TypeCluster } from "./types";

export function onDataTemplatesUpdate(root: Element, dataTemplates: Element): TypeCluster {
    return updateCluster(root)
}

export function updateCluster(root: Element): TypeCluster {
    const scdQueries = new SCDQueries(root);
    const ucci = new UCTypeDesigner(scdQueries);
    return {
        logicalDevices: ucci.findAllLogicalDevices(),
        bays: ucci.findAllBays(),
        ieds: ucci.findAllIEDs(),
        voltageLevels: ucci.findAllVoltageLevels(),
        substations: ucci.findAllSubstations(),
    };
}