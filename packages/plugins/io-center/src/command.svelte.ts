import type { IED } from "./ied/ied"
import { createIED, selectIED } from "./ied/ied-command"
import { createAndDispatchEditEvent, createStandardElement } from "@oscd-plugins/core-api/plugin/v1"
import type { StoreType } from "./store.svelte"
import type { Nullable } from "./types"
import type { TreeNode } from "./ui/components/object-tree/types.object-tree"

export class Command {
	constructor(
		private store: StoreType,
		private getHost: HostGetter,
	) { }

	public selectIED(ied: IED) {
		this.store.iedSelected = ied
	}

	public addIED() {
		if (!this.store.doc) { return }

		const sclRoot = this.store.doc.querySelector("SCL");
		if (!sclRoot) { return }

		const host = this.getHost()
		if (!host) {
			console.warn("could not find host element to dispatch event")
			return
		}

		const newIED = createStandardElement({
			xmlDocument: this.store.doc,
			standardVersion: "ed2",
			element: "ied",
		})
		newIED.setAttribute("name", `newIED-${this.store.doc.querySelectorAll("IED").length + 1}`)


		const editEvent = { node: newIED, parent: sclRoot, reference: null }
		createAndDispatchEditEvent({
			host,
			edit: editEvent,
		})

	}

	public buildObjectTree() {
		const doc = this.store.doc
		const iedSelected = this.store.iedSelected

		if (!doc || !iedSelected) return

		let tree: TreeNode[] = []

		const selectedIED = doc.querySelector(`IED[name="${iedSelected.name}"]`)

		if (!selectedIED) return

		const lDevices = Array.from(selectedIED.querySelectorAll("LDevice"))

		for (const lDevice of lDevices) {
			const device: TreeNode = { name: lDevice.getAttribute("inst") || "", children: [] }

			const lNodes = Array.from(lDevice.querySelectorAll("LN"))

			for (const lNode of lNodes) {
				const node: TreeNode = { name: lNode.getAttribute("lnClass") || "", children: [] }
				device.children.push(node)
			}

			tree.push(device)
		}

		this.store.objectTree = tree
	}

}

export function newCommand(store: StoreType, getHost: HostGetter) {
	return new Command(store, getHost)
}

type HostGetter = () => Nullable<HTMLElement>