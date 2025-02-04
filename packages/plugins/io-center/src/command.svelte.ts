import type { IED } from "./ied/ied"
import { createIED, selectIED } from "./ied/ied-command"
import { createAndDispatchEditEvent, createStandardElement } from "@oscd-plugins/core-api/plugin/v1"
import type { StoreType } from "./store.svelte"
import type { Nullable } from "./types"

export class Command {
	constructor(
		private store: StoreType,
		private getHost: HostGetter,
	){}

	public selectIED(ied: IED){
		this.store.iedSelected = ied
	}

	public addIED(){
		if(!this.store.doc){ return }

		const sclRoot = this.store.doc.querySelector("SCL");
		if(!sclRoot){ return }

		const host = this.getHost()
		if(!host){ 
			console.warn("could not find host element to dispatch event")
			return
		}

		const newIED = createStandardElement({
			xmlDocument: this.store.doc,
			standardVersion: "ed2",
			element: "ied",
		})
		newIED.setAttribute("name", `newIED-${this.store.doc.querySelectorAll("IED").length + 1}`)
		

		const editEvent = {node: newIED, parent: sclRoot, reference: null}
		createAndDispatchEditEvent({
			host,
			edit: editEvent,
		})

	}

}

export function newCommand(store: StoreType, getHost: HostGetter ){
	return new Command(store, getHost)
}

type HostGetter = () => Nullable<HTMLElement>