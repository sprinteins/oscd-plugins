import { NODE_TYPE } from "./headless/constants";
import type { IED } from "./ied/ied";
import type { StoreType } from "./store.svelte";
import store from "./store.svelte"
import type { TreeNode } from "./ui/components/object-tree/types.object-tree";

export function initQuery(store: StoreType) {
	runQueries(store)

	$effect(() => {
		console.log("(2) doc changed", store.doc)
		runQueries(store)
	})
}

function runQueries(store: StoreType) {
	collectIEDs(store)
}

function collectIEDs(store: StoreType) {
	const doc = store.doc

	if (!doc) {
		return
	}

	const iedElements = Array.from(doc.querySelectorAll("IED"))
	const ieds: IED[] = iedElements.map(iedElementToIED)

	store.iedList = ieds
}

function iedElementToIED(iedElement: Element): IED {
	return {
		name: iedElement.getAttribute("name") ?? "unknown"
	}
}


export function buildObjectTree() {
	const doc = store.doc
	const iedSelected = store.iedSelected

	if (!doc || !iedSelected) return

	let tree: TreeNode[] = []

	const selectedIED = doc.querySelector(`IED[name="${iedSelected.name}"]`)

	if (!selectedIED) return

	const lDevices = Array.from(selectedIED.querySelectorAll("LDevice"))

	for (const lDevice of lDevices) {
		const device: TreeNode = { id: crypto.randomUUID(), name: lDevice.getAttribute("inst") || "", type: NODE_TYPE.logicalDevice, isOpen: true, children: [] }

		const lNodes = Array.from(lDevice.querySelectorAll("LN"))

		for (const lNode of lNodes) {
			const node: TreeNode = { id: crypto.randomUUID(), name: lNode.getAttribute("lnClass") || "", type: NODE_TYPE.logicalNode, isOpen: true, children: [] }

			const dObjects = Array.from(lNode.querySelectorAll("DOI"))

			for (const dObject of dObjects) {
				const object: TreeNode = { id: crypto.randomUUID(), name: dObject.getAttribute("name") || "", type: NODE_TYPE.dataObjectInstance }

				if (node.children) {
					node.children.push(object)
				}
			}

			if (device.children) {
				device.children.push(node)
			}
		}

		tree.push(device)
	}

	store.objectTree = tree
}