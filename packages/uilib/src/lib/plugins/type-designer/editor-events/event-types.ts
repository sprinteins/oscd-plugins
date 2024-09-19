import { BayType, IEDType, LDeviceType, SubstationType, VoltageLevelType } from "../types/nodes";

interface BaseEvent<T> {
    type: T;
}

export type CreateBayEvent = BaseEvent<BayType>;
export type DeleteBayEvent = BaseEvent<BayType>;

export type CreateSubstationEvent = BaseEvent<SubstationType>;
export type DeleteSubstationEvent = BaseEvent<SubstationType>;

export type CreateLDeviceEvent = BaseEvent<LDeviceType>;
export type DeleteLDeviceEvent = BaseEvent<LDeviceType>;

export type CreateIEDEvent = BaseEvent<IEDType>;
export type DeleteIEDEvent = BaseEvent<IEDType>;

export type CreateVoltageLevelEvent = BaseEvent<VoltageLevelType>;
export type DeleteVoltageLevelEvent = BaseEvent<VoltageLevelType>;