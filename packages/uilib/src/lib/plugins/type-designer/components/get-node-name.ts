import { BayType, IEDType, LDeviceType, SubstationType, VoltageLevelType } from "../types"

export function getNodeName(node: BayType | IEDType | LDeviceType | VoltageLevelType | SubstationType): string {
    if ('inst' in node) return 'LDeviceType';
    if ('manufacturer' in node) return 'IEDType';
    if ('nomFreq' in node) return 'VoltageLevelType';
    if ('name' in node && 'desc' in node) return 'BayType';
    return 'SubstationType';
}