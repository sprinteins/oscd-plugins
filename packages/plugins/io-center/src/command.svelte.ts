import { createAndDispatchEditEvent } from "@oscd-plugins/core-api/plugin/v1"
import { store } from "./store.svelte"
import type { Nullable } from "./types"
import { lpStore } from "./ui/components/lp-list/lp-store.svelte"

export class Command {
	constructor(
		private getHost: HostGetter,
	) { }

	public addLp() {
		if (!store.doc) { return }

		const sclRoot = store.doc.querySelector("SCL");

		if (!sclRoot) { return }

		const host = this.requireHost()

		const { type, name, desc, instance } = lpStore.dialogFormData

		const ied = store.doc.querySelector(`IED[name="${store.selectedIED?.name}"]`)

		if (!ied) {
			throw new Error(`IED with name ${store.selectedIED} not found`)
		}

		const ld0 = this.ensureLD0(ied)

		const newLP = store.doc.createElement("LN")

		newLP.setAttribute("xmlns", "")
		if (desc) {
			newLP.setAttribute("desc", desc)
		}
		newLP.setAttribute("lnClass", type)
		newLP.setAttribute("inst", `${instance}` || `${ld0.querySelectorAll(`LN[lnType="${type}"]`).length + 1}`)
		newLP.setAttribute("lnType", name || type)

		createAndDispatchEditEvent({
			host,
			edit: { node: newLP, parent: ld0, reference: null },
		})
	}

	public addLC(iedName: string, type: string, instance: string) {
		if (!store.doc) { console.warn("no doc"); return; }

		const host = this.requireHost()

		const ied = store.doc.querySelector(`IED[name="${iedName}"]`)
		if (!ied) {
			throw new Error(`IED with name ${iedName} not found`)
		}
		const ld0 = this.ensureLD0(ied)

		const ln = store.doc.createElement('LN')
		ln.setAttribute('lnType', type)
		ln.setAttribute('lnClass', type)
		ln.setAttribute('inst', instance)

		const editEvent = { node: ln, parent: ld0, reference: null }
		createAndDispatchEditEvent({
			host,
			edit: editEvent,
		})
	}

	private ensureLD0(ied: Element): Element {
		const host = this.requireHost()

		let ld0 = ied.querySelector('LDevice[inst="LD0"]')
		if (ld0) {
			return ld0
		}

		let accessPoint = ied.querySelector('AccessPoint')
		console.log("accessPoint 1:", accessPoint)
		if (!accessPoint) {
			const newAccessPoint = store.doc.createElement('AccessPoint')
			newAccessPoint.setAttribute('name', 'AP1')
			createAndDispatchEditEvent({
				host,
				edit: { node: newAccessPoint, parent: ied, reference: null },
			})
			accessPoint = ied.querySelector('AccessPoint')
			console.log("accessPoint 2:", accessPoint)
		}
		if (!accessPoint) { throw new Error('server still does not exist') }

		let server = accessPoint?.querySelector('Server')
		console.log("server 1:", server)
		if (!server) {
			const newServer = store.doc.createElement('Server')
			createAndDispatchEditEvent({
				host,
				edit: { node: newServer, parent: accessPoint, reference: null },
			})
			server = accessPoint?.querySelector('Server')
			console.log("server 2:", server)
		}
		if (!server) { throw new Error('server still does not exist') }

		const newLD0 = store.doc.createElement('LDevice')
		newLD0.setAttribute('inst', 'LD0')
		createAndDispatchEditEvent({
			host,
			edit: { node: newLD0, parent: server, reference: null },
		})
		ld0 = ied.querySelector('LDevice[inst="LD0"]')
		if (!ld0) { throw new Error('ld0 still does not exist') }

		return ld0
	}


	private requireHost() {
		const host = this.getHost()
		if (!host) {
			throw new Error('no host element found')
		}
		return host
	}

}

export function newCommand(getHost: HostGetter) {
	return new Command(getHost)
}


type HostGetter = () => Nullable<HTMLElement>