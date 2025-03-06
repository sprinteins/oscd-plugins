import { createAndDispatchEditEvent } from "@oscd-plugins/core-api/plugin/v1"
import { store } from "./store.svelte"
import type { Nullable } from "./types"
import { lpStore } from "./ui/components/lp-list/lp-store.svelte"
import type { LpElement, LpTypes } from "./ui/components/lp-list/types.lp-list"

export class Command {
	constructor(
		private getHost: HostGetter,
	) { }

	public addLp() {
		if (!store.doc) { return }

		const sclRoot = store.doc.querySelector("SCL");

		if (!sclRoot) { return }

		const host = this.requireHost()

		const { type, name, desc, number } = lpStore.dialogFormData

		const ied = store.doc.querySelector(`IED[name="${store.selectedIED?.name}"]`)

		if (!ied) {
			throw new Error(`IED with name ${store.selectedIED} not found`)
		}

		const ld0 = this.ensureLD0(ied)

		const currentLPNumber = ld0.querySelectorAll(`LN[lnClass="${type}"]`).length

		if (!number) {
			const newLP = store.doc.createElement("LN")

			newLP.setAttribute("xmlns", "")
			if (desc) {
				newLP.setAttribute("desc", desc)
			}
			newLP.setAttribute("lnClass", type)
			newLP.setAttribute("inst", `${currentLPNumber + 1}`)
			newLP.setAttribute("lnType", name || type)

			createAndDispatchEditEvent({
				host,
				edit: { node: newLP, parent: ld0, reference: null },
			})
			return
		}

		for (let i = 1; i <= number; i++) {
			const newLP = store.doc.createElement("LN")

			newLP.setAttribute("xmlns", "")
			if (desc) {
				newLP.setAttribute("desc", desc)
			}
			newLP.setAttribute("lnClass", type)
			newLP.setAttribute("inst", `${currentLPNumber + i}`)
			newLP.setAttribute("lnType", name || type)

			createAndDispatchEditEvent({
				host,
				edit: { node: newLP, parent: ld0, reference: null },
			})
		}
	}

	public removeLP(lpElement: LpElement) {
		if (!store.doc) { console.warn("no doc"); return; }

		const host = this.requireHost()

		const ied = store.doc.querySelector(`IED[name="${store.selectedIED?.name}"]`)

		if (!ied) {
			throw new Error(`IED with name ${store.selectedIED?.name} not found`)
		}

		//Delete target LP
		const lpToDelete = ied.querySelector(`AccessPoint > Server > LDevice[inst="LD0"] > LN[lnType="${lpElement.name}"][inst="${lpElement.instance}"][lnClass="${lpElement.type}"]`)

		if (!lpToDelete) {
			throw new Error(`LP element with name ${lpElement.name}-${lpElement.instance} not found!`)
		}

		createAndDispatchEditEvent({
			host,
			edit: {
				node: lpToDelete
			}
		})

		//Correct instance attribute for any LP that's after the target
		const remainingLPs = Array.from(ied.querySelectorAll(`AccessPoint > Server > LDevice[inst="LD0"] > LN[lnClass="${lpElement.type}"]`))

		const deletedLpInstance = Number.parseInt(lpElement.instance)

		for (const lp of remainingLPs.slice(deletedLpInstance - 1)) {
			createAndDispatchEditEvent({
				host,
				edit: {
					element: lp,
					attributes: { "inst": `${Number.parseInt(lp.getAttribute("inst") || "") - 1}` },
					attributesNS: {}
				}
			})
		}
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