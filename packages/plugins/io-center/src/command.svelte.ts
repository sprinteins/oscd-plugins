import type { IED } from "./ied/ied"
import type { StoreType } from "./store.svelte"

class Command {
	constructor(
		private state: StoreType
	){}

	public iedSelect(ied: IED){
		this.state.iedSelected = ied
	}

}

export function newCommand(state: StoreType){
	return new Command(state)
}