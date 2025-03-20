import { canvasStore } from "@/ui/components/canvas/canvas-store.svelte";
import type { ConnectionPoint } from "@/ui/components/canvas/types.canvas";
import type { TreeNode } from "@/ui/components/object-tree/types.object-tree";

export function searchTree(tree: TreeNode[], searchTerm: string): TreeNode[] {
    return tree
        .map(node => {
            if (node.name.toLowerCase().includes(searchTerm.toLowerCase())) {
                return node;
            }
            if (node.children) {
                const filteredChildren = searchTree(node.children, searchTerm);
                if (filteredChildren.length > 0) {
                    return { ...node, children: filteredChildren };
                }
            }
            return null;
        })
        .filter(node => node !== null);
}

export function startDrawing(event: MouseEvent) {
    event.preventDefault();
    if (!event.target || !event.currentTarget) {
        return;
    }
    canvasStore.drawStartPoint = event.target;
    const currentTarget = event.currentTarget as HTMLElement;
    if (!currentTarget.parentElement) {
        return;
    }
    canvasStore.startNode = currentTarget.parentElement.getAttribute("data-title");
}

export function isWrongColumn(node1: string, node2: string) {
    if (!canvasStore.container) {
        return false;
    }

    const column1 = canvasStore.container
        .querySelector(`[data-title="${node1}"]`)
        ?.closest(".flex-col");
    const column2 = canvasStore.container
        .querySelector(`[data-title="${node2}"]`)
        ?.closest(".flex-col");
    if (!column1 || !column2) {
        return false;
    }
    if (column1 === column2) {
        return true;
    }

    const column1Title = column1.getAttribute("data-title");
    const column2Title = column2.getAttribute("data-title");
    if (!column1Title || !column2Title) {
        return false;
    }

    if (
        (column1Title === "DO" && column2Title === "LP") ||
        (column1Title === "LP" && column2Title === "DO")
    ) {
        return true;
    }
    return false;
}

export function isSameSide(startSide: string, targetSide: string) {
    return (
        (startSide.includes("left-circle") && targetSide.includes("left")) ||
        (startSide.includes("right-circle") && targetSide.includes("right"))
    );
}

export function connectionExists(fromNode: string, fromIndex: number, toNode: string, toIndex: number) {
    return canvasStore.connections.some(
        (connection) =>
            (connection.from.name === fromNode &&
                connection.to.name === toNode) &&
            (connection.from.index === fromIndex &&
                connection.to.index === toIndex) ||
            (connection.from.name === toNode &&
                connection.to.name === fromNode) &&
            (connection.from.index === toIndex &&
                connection.to.index === fromIndex),
    );
}

export function stopDrawing(targetNode: string, targetSide: string, index: number) {
    const startCircle = canvasStore.lastStartPoint;
    canvasStore.lastStartPoint = null;

    if (!canvasStore.container) {
        return;
    }

    const target = canvasStore.container.querySelector(
        `[data-title="${targetNode}-${targetSide}"]`,
    ) as HTMLElement | null;

    if (startCircle && target && startCircle !== target) {
        let fromNode = canvasStore.startNode;
        if (!fromNode) {
            return;
        }

        let toNode = `${targetNode}-${targetSide}`;

        if (startCircle instanceof HTMLElement)
            if (
                fromNode === toNode ||
                isWrongColumn(fromNode, toNode) ||
                isSameSide(startCircle.id, targetSide)
            ) {
                return;
            }

        if (
            startCircle instanceof HTMLElement &&
            startCircle.id === "left-circle"
        ) {
            [fromNode, toNode] = [toNode, fromNode];
        }

        let startCircleIndex = null

        if (startCircle instanceof HTMLElement) {
            startCircleIndex = Number.parseInt(startCircle.id.split("-")[2]);
        }

        if (startCircleIndex !== null && !connectionExists(fromNode, startCircleIndex, toNode, index)) {
            canvasStore.connections = [
                ...canvasStore.connections,
                {
                    id: `${fromNode}-${startCircleIndex}-${toNode}-${index}`,
                    from: { name: fromNode, index: startCircleIndex },
                    to: { name: toNode, index: index },
                },
            ];
        }
    }
}

export function getCoordinates(connectionPoint: ConnectionPoint) {
    if (!canvasStore.svgElement || !canvasStore.container) {
        return { x: 0, y: 0 };
    }

    const target = canvasStore.container.querySelector(
        `[data-title="${connectionPoint.name}"]`,
    ) as HTMLElement | null;

    if (!target) {
        return { x: 0, y: 0 };
    }

    const circle = target.querySelector(`#${connectionPoint.name.includes("left") ? "left" : "right"}-circle-${connectionPoint.index}`);

    if (!circle) {
        return { x: 0, y: 0 };
    }

    const rect = circle.getBoundingClientRect();

    const svgPoint = new DOMPoint(
        rect.left + rect.width / 2,
        rect.top + rect.height / 2,
    );

    const transformedPoint = svgPoint.matrixTransform(
        canvasStore.svgElement.getScreenCTM()?.inverse(),
    );
    return { x: transformedPoint.x, y: transformedPoint.y };
}

export function getCirclePosition(target: EventTarget | null) {
    if (
        !target ||
        !(target instanceof HTMLElement) ||
        !canvasStore.svgElement
    ) {
        return { x: 0, y: 0 };
    }

    const rect = target.getBoundingClientRect();

    const svgPoint = new DOMPoint(
        rect.left + rect.width / 2,
        rect.top + rect.height / 2,
    );

    const transformedPoint = svgPoint.matrixTransform(
        canvasStore.svgElement.getScreenCTM()?.inverse(),
    );
    return { x: transformedPoint.x, y: transformedPoint.y };
}

export function redrawConnections() {
    canvasStore.connections = [...canvasStore.connections];
}
