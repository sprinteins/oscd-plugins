import { canvasStore } from "@/ui/components/canvas/canvas-store.svelte";
import type { LpElement } from "@/ui/components/lp-list/types.lp-list";
import type { TreeNode } from "@/ui/components/object-tree/types.object-tree";

export function addObjectToCanvas(node: TreeNode) {
	const alreadyInCanvas = canvasStore.dataObjects.some(item => item.id === node.id)
    if (alreadyInCanvas) { return }

    canvasStore.dataObjects.push({ id: node.id, name: node.name })
}

export function toggleObjectInCanvas(node: TreeNode) {
	const alreadyInCanvas = canvasStore.dataObjects.some(item => item.id === node.id)
	if (alreadyInCanvas) {
		removeObjectFromCanvas(node);
	}else {
		addObjectToCanvas(node);
	}
}

export function removeObjectFromCanvas(node: TreeNode) {
	canvasStore.dataObjects = canvasStore.dataObjects.filter((item) => item.id !== node.id);
}

export function clearObjectCanvas(){
	canvasStore.dataObjects = [];
}

export function addLpElementToCanvas(element: LpElement) {
    if (canvasStore.logicalPhysicals.some(item => item.id === element.id)) {
        canvasStore.logicalPhysicals = canvasStore.logicalPhysicals.filter((item) => item.id !== element.id);
        return;
    }

    canvasStore.logicalPhysicals.push({ id: element.id, name: element.name })
}
