import type { LP_TYPE } from "@/headless/constants"

export type LpElement = {
    id: string,
    type: keyof typeof LP_TYPE
    name: string,
    isLinked: boolean,
}
