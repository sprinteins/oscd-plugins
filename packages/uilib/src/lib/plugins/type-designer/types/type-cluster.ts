import { type BayTypeElement, type IEDTypeElement, type LDeviceTypeElement, type VoltageLevelTypeElement } from "@oscd-plugins/core";

// TODO erweitern
export type TypeCluster = {
    logicalDevices: LDeviceTypeElement[]
    bays: BayTypeElement[]
    ieds: IEDTypeElement[]
    voltageLevels: VoltageLevelTypeElement[]
}