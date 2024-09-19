interface BaseNode {
    id: string;
    desc: string;
}

export interface DataTypeTemplates {}

export interface LDeviceType extends BaseNode {
    inst: string;
}

export interface BayType extends BaseNode {
    name: string;
}

export interface IEDType extends BaseNode {
    name: string;
    originalSclRevision: string;
    originalSclVersion: string;
    owner: string;
    configVersion: string;
    manufacturer: string;
    type: string;
}

export interface VoltageLevelType extends BaseNode {
    name: string;
    nomFreq: string;
    numPhases: string;
}

export interface SubstationType extends BaseNode {
    name: string;
}