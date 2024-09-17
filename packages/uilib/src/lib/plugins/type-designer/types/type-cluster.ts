import { type BayTypeElement, type IEDTypeElement, type LDeviceTypeElement, type VoltageLevelTypeElement } from "@oscd-plugins/core";

export type TypeCluster = {
    logicalDevices: LDeviceTypeElement[]
    bays: BayTypeElement[]
    ieds: IEDTypeElement[]
    voltageLevels: VoltageLevelTypeElement[]
}