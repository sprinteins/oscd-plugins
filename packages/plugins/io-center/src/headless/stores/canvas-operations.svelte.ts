import { canvasStore } from "@/ui/components/canvas/canvas-store.svelte";
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
	} else {
		addObjectToCanvas(node);
	}
}

export function removeObjectFromCanvas(node: TreeNode) {
	canvasStore.dataObjects = canvasStore.dataObjects.filter((item) => item.id !== node.id);
}
