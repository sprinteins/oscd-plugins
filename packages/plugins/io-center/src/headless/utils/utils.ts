import type { ObjectNodeDataObject, ObjectTree } from '@/ied/object-tree.type'
import { store } from '@/store.svelte'
import { canvasStore } from '@/ui/components/canvas/canvas-store.svelte'
import type {
    Connection,
    ConnectionPoint,
    ConnectionPort,
    LogicalConditioner,
    NodeElement,
    NodeElementType
} from '@/ui/components/canvas/types.canvas'
import type { TreeNode } from '@/ui/components/object-tree/types.object-tree'
import { tick } from 'svelte'
import { RESTRICTED_LC_TYPES_BY_CDC, NODE_ELEMENT_TYPE, PORTS_CONFIG_PER_TYPE } from '../constants'
import _ from "lodash"
import { toast } from '@zerodevx/svelte-toast'

export function searchTree(tree: TreeNode[], searchTerm: string): TreeNode[] {
    return tree
        .map((node) => {
            if (node.name.toLowerCase().includes(searchTerm.toLowerCase())) {
                return node
            }
            if (node.children) {
                const filteredChildren = searchTree(node.children, searchTerm)
                if (filteredChildren.length > 0) {
                    return { ...node, children: filteredChildren }
                }
            }
            return null
        })
        .filter((node) => node !== null)
}

export function getPortsConfig(node: NodeElement): ConnectionPort[] {
    switch (node.type) {
        case NODE_ELEMENT_TYPE.DO:
            return [{ name: node.name, side: "right" }];
        default:
            return PORTS_CONFIG_PER_TYPE[node.lnClass];
    }
}

export function startDrawing(event: MouseEvent, port: ConnectionPort, type: NodeElementType) {
    event.preventDefault()
    if (!event.target || !event.currentTarget) {
        return
    }
    canvasStore.drawStartPoint = event.target
    const currentTarget = event.currentTarget as HTMLElement
    if (!currentTarget.parentElement) {
        return
    }
    canvasStore.startNode =
        currentTarget.parentElement.getAttribute('data-title')
    canvasStore.startPort = port
    canvasStore.startNodeType = type
}

export function isWrongColumn(node1: string, node2: string) {
    if (!canvasStore.container) {
        return false
    }

    const column1 = canvasStore.container
        .querySelector(`[data-title="${node1}"]`)
        ?.closest('.flex-col')
    const column2 = canvasStore.container
        .querySelector(`[data-title="${node2}"]`)
        ?.closest('.flex-col')
    if (!column1 || !column2) {
        return false
    }
    if (column1 === column2) {
        return true
    }

    const column1Title = column1.getAttribute('data-title')
    const column2Title = column2.getAttribute('data-title')
    if (!column1Title || !column2Title) {
        return false
    }

    if (
        (column1Title === 'DO' && column2Title === 'LP') ||
        (column1Title === 'LP' && column2Title === 'DO')
    ) {
        return true
    }
    return false
}

export function isSameSide(startSide: string, targetSide: string) {
    return (
        (startSide.includes('left-circle') && targetSide.includes('left')) ||
        (startSide.includes('right-circle') && targetSide.includes('right'))
    )
}

export function connectionExists(
    fromNode: string,
    toNode: string,
    fromPort: ConnectionPort,
    toPort: ConnectionPort,
) {
    return store.connections.some(
        (connection) =>
            (connection.from.name === fromNode && connection.to.name === toNode && _.isEqual(connection.from.port, fromPort) && _.isEqual(connection.to.port, toPort)) ||
            (connection.from.name === toNode && connection.to.name === fromNode) && _.isEqual(connection.from.port, toPort) && _.isEqual(connection.to.port, fromPort)
    )
}

export function isDoToLcConnectionAllowed(dataObject: ObjectNodeDataObject, lc: LogicalConditioner): boolean {
    const cdc = dataObject.cdcType

    if (!cdc) {
        console.warn(`DO (id: ${dataObject.id}) has no cdc type defined!`)
        return false
    }

    if (!RESTRICTED_LC_TYPES_BY_CDC[cdc]) {
        return true
    }

    if (RESTRICTED_LC_TYPES_BY_CDC[cdc].includes(lc.type)) {
        return true
    }

    toast.push(`Data Object with cdc (${cdc}) can not be linked to a Logical Conditioner of type ${lc.type}!`)
    return false
}

export function stopDrawing(
    port: ConnectionPort,
    targetNode: string,
    type: NodeElementType,
    addConnection: (connection: Connection) => void
) {
    const startCircle = canvasStore.lastStartPoint
    const startPort = canvasStore.startPort
    const startNodeType = canvasStore.startNodeType
    canvasStore.lastStartPoint = null
    canvasStore.startPort = null
    canvasStore.startNodeType = null

    if (!canvasStore.container) {
        return
    }

    const target = canvasStore.container.querySelector(
        `[data-title="${targetNode}-${port.side}"]`
    ) as HTMLElement | null

    if (startCircle && target && startCircle !== target) {
        const fromNode = canvasStore.startNode
        if (!fromNode) {
            return
        }

        const toNode = `${targetNode}-${port.side}`

        if (startCircle instanceof HTMLElement)
            if (
                fromNode === toNode ||
                isWrongColumn(fromNode, toNode) ||
                isSameSide(startCircle.id, port.side)
            ) {
                return
            }

        if (
            startPort &&
            startNodeType &&
            !connectionExists(fromNode, toNode, startPort, port)
        ) {
            const connection = {
                id: `${fromNode}-${startPort.name}${startPort.index ?? ""}-${toNode}-${port.name}${port.index ?? ""}`,
                from: {
                    name: fromNode,
                    type: startNodeType,
                    port: startPort,
                },
                to: {
                    name: toNode,
                    type: type,
                    port: port,
                }
            }

            addConnection(connection)
        }
    }
}

export async function getCoordinates(connectionPoint: ConnectionPoint) {
    await tick()

    if (!canvasStore.svgElement || !canvasStore.container) {
        return { x: 0, y: 0 }
    }

    const target = canvasStore.container.querySelector(
        `[data-title="${connectionPoint.name}"]`
    ) as HTMLElement | null

    if (!target) {
        return { x: 0, y: 0 }
    }

    const portNumber = connectionPoint.port.index || connectionPoint.port.index === 0 ? `${connectionPoint.port.index}` : "";

    const circle = target.querySelector(
        `#${connectionPoint.port.side}-circle-${connectionPoint.port.name}${portNumber}`
    )

    if (!circle) {
        return { x: 0, y: 0 }
    }

    const rect = circle.getBoundingClientRect()

    const svgPoint = new DOMPoint(
        rect.left + rect.width / 2,
        rect.top + rect.height / 2
    )

    const transformedPoint = svgPoint.matrixTransform(
        canvasStore.svgElement.getScreenCTM()?.inverse()
    )
    return { x: transformedPoint.x, y: transformedPoint.y }
}

export function getCirclePosition(target: EventTarget | null) {
    if (
        !target ||
        !(target instanceof HTMLElement) ||
        !canvasStore.svgElement
    ) {
        return { x: 0, y: 0 }
    }

    const rect = target.getBoundingClientRect()

    const svgPoint = new DOMPoint(
        rect.left + rect.width / 2,
        rect.top + rect.height / 2
    )

    const transformedPoint = svgPoint.matrixTransform(
        canvasStore.svgElement.getScreenCTM()?.inverse()
    )
    return { x: transformedPoint.x, y: transformedPoint.y }
}

export function redrawConnections() {
    store.connections = [...store.connections]
}
