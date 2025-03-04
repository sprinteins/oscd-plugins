import { createIED, selectIED } from "./ied/ied-command"
import { createAndDispatchEditEvent, createStandardElement } from "@oscd-plugins/core-api/plugin/v1"
import { type Store, store } from "./store.svelte"
import type { Nullable } from "./types"
import type { TreeNode } from "./ui/components/object-tree/types.object-tree"

export class Command {
	constructor(
		private getHost: HostGetter,
	) { }

	public addLC(iedName: string, type: string, instance: string){
		if(!store.doc){ console.warn("no doc"); return; }

		const host = this.requireHost()

		const ied = store.doc.querySelector(`IED[name="${iedName}"]`)
		if(!ied){ 
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
		if(ld0){
			return ld0
		}

		let accessPoint = ied.querySelector('AccessPoint')
		console.log("accessPoint 1:", accessPoint)
		if(!accessPoint){
			const newAccessPoint = store.doc.createElement('AccessPoint')
			newAccessPoint.setAttribute('name', 'AP1')
			createAndDispatchEditEvent({
				host,
				edit: { node: newAccessPoint, parent: ied, reference: null },
			})
			accessPoint = ied.querySelector('AccessPoint')
			console.log("accessPoint 2:", accessPoint)
		}
		if(!accessPoint){ throw new Error('server still does not exist') }

		let server = accessPoint?.querySelector('Server')
		console.log("server 1:", server)
		if(!server){
			const newServer = store.doc.createElement('Server')
			createAndDispatchEditEvent({
				host,
				edit: { node: newServer, parent: accessPoint, reference: null },
			})
			server = accessPoint?.querySelector('Server')
			console.log("server 2:", server)
		}
		if(!server){ throw new Error('server still does not exist') }

		const newLD0 = store.doc.createElement('LDevice')
		newLD0.setAttribute('inst', 'LD0')
		createAndDispatchEditEvent({
			host,
			edit: { node: newLD0, parent: server, reference: null },
		})
		ld0 = ied.querySelector('LDevice[inst="LD0"]')
		if(!ld0){ throw new Error('ld0 still does not exist') }

		return ld0
	}


	private requireHost(){
		const host = this.getHost()
		if(!host){
			throw new Error('no host element found')
		}
		return host
	}

}

export function newCommand(getHost: HostGetter) {
	return new Command(getHost)
}

type HostGetter = () => Nullable<HTMLElement>