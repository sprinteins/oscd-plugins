import type { LP_TYPE } from "@/headless/constants"

export type LpElement = {
    id: string,
    type: keyof typeof LP_TYPE
    name: string,
    instance: string,
    description: string,
    isLinked: boolean,
}

export type LpTypes = keyof typeof LP_TYPE
