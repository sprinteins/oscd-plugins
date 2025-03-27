import type { LP_TYPE } from "@/headless/constants"

export type LpElement = {
    id: string,
    type: LpTypes
    name: string,
    instance: string,
    description: string,
    isLinked: boolean,
    numberOfLPDOPorts?: number;
}

export type FormData = {
    name: string;
    number?: number;
    numberOfLPDOPorts?: number;
    desc: string;
    type: keyof typeof LP_TYPE | "";
}

export type LpTypes = keyof typeof LP_TYPE
