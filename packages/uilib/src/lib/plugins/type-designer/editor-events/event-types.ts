import { BayType } from "../types";
import { IEDType, LDeviceType, SubstationType, VoltageLevelType } from "../types/nodes";

export interface CreateBayEvent {
    bay: BayType;
}

export interface DeleteBayEvent {
    bay: BayType;
}

export interface CreateSubstationEvent {
    substation: SubstationType;
}

export interface DeleteSubstationEvent {
    substation: SubstationType;
}

export interface CreateLDeviceEvent {
    lDevice: LDeviceType;
}

export interface DeleteLDeviceEvent {
    lDevice: LDeviceType;
}

export interface CreateIEDEvent {
    ied: IEDType;
}

export interface DeleteIEDEvent {
    ied: IEDType;
}

export interface CreateVoltageLevelEvent {
    vLevel: VoltageLevelType;
}

export interface DeleteVoltageLevelEvent {
    vLevel: VoltageLevelType;
}