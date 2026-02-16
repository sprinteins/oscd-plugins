import type { LNodeTemplate } from "@/headless/common-types"
import { parseLDeviceInst } from "../elements"

export function queryMatchingBayLNode(
    bay: Element,
    lNodeTemplate: LNodeTemplate,
    lDeviceInst: string,
    iedName: string
): Element | null {
    const parsed = parseLDeviceInst(lDeviceInst)
    if (!parsed) return null

    const { equipmentName, functionName } = parsed

    let targetFunction: Element | null = null

    if (equipmentName) {
        const equipment = bay.querySelector(
            `ConductingEquipment[name="${equipmentName}"]`
        )
        if (equipment) {
            targetFunction = equipment.querySelector(
                `:scope > EqFunction[name="${functionName}"]`
            )
        }
    } else {
        targetFunction = bay.querySelector(
            `:scope > Function[name="${functionName}"]`
        )
    }

    if (!targetFunction) return null

    const matchingLNode = targetFunction.querySelector(
        `:scope > LNode[lnClass="${lNodeTemplate.lnClass}"][lnType="${lNodeTemplate.lnType}"][lnInst="${lNodeTemplate.lnInst}"][iedName="${iedName}"]`
    )

    return matchingLNode
}