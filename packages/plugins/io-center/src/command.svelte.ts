import type { IED } from "./ied/ied"
import { createAndDispatchEditEvent, createCustomElement, createStandardElement } from "@oscd-plugins/core-api/plugin/v1"
import type { StoreType } from "./store.svelte"
import type { Nullable } from "./types"
import type { LP_TYPE } from "./headless/constants"
import { lpStore } from "./ui/components/lp-list/lp-store.svelte"

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

	public addLp() {
		if (!this.store.doc) { return }

		const sclRoot = this.store.doc.querySelector("SCL");
		if (!sclRoot) { return }

		const host = this.getHost()
		if (!host) {
			console.warn("could not find host element to dispatch event")
			return
		}

		const { type, name, desc, instance } = lpStore.dialogFormData

		let lDevice0 = this.store.doc.querySelector(`IED[name="${this.store.iedSelected?.name}"] > AccessPoint > Server > LDevice[inst="LD0"]`);

		if (!lDevice0) {
			const server = this.store.doc.querySelector(`IED[name="${this.store.iedSelected?.name}"] > AccessPoint > Server`)

			if (!server) { return }

			const firstLDevice = server.querySelectorAll("LDevice")[0]

			lDevice0 = this.store.doc.createElement("LDevice")
			lDevice0.setAttribute("inst", "LD0")

			createAndDispatchEditEvent({
				host,
				edit: { node: lDevice0, parent: server, reference: firstLDevice },
			})
		}

		const newLP = this.store.doc.createElement("LN")

		newLP.setAttribute("xmlns", "")
		if (desc) {
			newLP.setAttribute("desc", desc)
		}
		newLP.setAttribute("lnClass", type)
		newLP.setAttribute("inst", instance || `${lDevice0.querySelectorAll(`LN[lnType="${type}"]`).length + 1}`)
		newLP.setAttribute("lnType", name || type)

		createAndDispatchEditEvent({
			host,
			edit: { node: newLP, parent: lDevice0, reference: null },
		})
	}
}

export function newCommand(store: StoreType, getHost: HostGetter) {
	return new Command(store, getHost)
}

type HostGetter = () => Nullable<HTMLElement>