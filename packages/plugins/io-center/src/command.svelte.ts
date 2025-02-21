import type { IED } from "./ied/ied"
import { createIED, selectIED } from "./ied/ied-command"
import { createAndDispatchEditEvent, createStandardElement } from "@oscd-plugins/core-api/plugin/v1"
import { type Store, store } from "./store.svelte"
import type { Nullable } from "./types"
import type { TreeNode } from "./ui/components/object-tree/types.object-tree"

export class Command {
	constructor(
		private getHost: HostGetter,
	) { }


	public addIED() {
		if (!store.doc) { return }

		const sclRoot = store.doc.querySelector("SCL");
		if (!sclRoot) { return }

		const host = this.getHost()
		if (!host) {
			console.warn("could not find host element to dispatch event")
			return
		}

		const newIED = createStandardElement({
			xmlDocument: store.doc,
			standardVersion: "ed2",
			element: "ied",
		})
		newIED.setAttribute("name", `newIED-${store.doc.querySelectorAll("IED").length + 1}`)


		const editEvent = { node: newIED, parent: sclRoot, reference: null }
		createAndDispatchEditEvent({
			host,
			edit: editEvent,
		})

	}
}

export function newCommand(getHost: HostGetter) {
	return new Command(getHost)
}

type HostGetter = () => Nullable<HTMLElement>