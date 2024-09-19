import { BayType } from "../types";
import { IEDType, LDeviceType, SubstationType, VoltageLevelType } from "../types/nodes";

export interface CreateBayEvent {
    type: BayType;
}

export interface DeleteBayEvent {
    type: BayType;
}

export interface CreateSubstationEvent {
    type: SubstationType;
}

export interface DeleteSubstationEvent {
    type: SubstationType;
}

export interface CreateLDeviceEvent {
    type: LDeviceType;
}

export interface DeleteLDeviceEvent {
    type: LDeviceType;
}

export interface CreateIEDEvent {
    type: IEDType;
}

export interface DeleteIEDEvent {
    type: IEDType;
}

export interface CreateVoltageLevelEvent {
    type: VoltageLevelType;
}

export interface DeleteVoltageLevelEvent {
    type: VoltageLevelType;
}