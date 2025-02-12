import type { IED } from "./ied/ied";
import type { StoreType } from "./store.svelte";

export function initQuery(state: StoreType){
	
	runQueries(state)
	
	$effect(() => {
		console.log("(2) doc changed", state.doc)
		runQueries(state)
	})

}

function runQueries(state: StoreType){
	collectIEDs(state)
}

function collectIEDs(store: StoreType){
	const doc = store.doc
	if(!doc){ return }
	
	const iedElements = Array.from(doc.querySelectorAll("IED"))
	const ieds: IED[] = iedElements.map( iedElementToIED )
	
	store.iedList = ieds

}

function iedElementToIED(iedElement: Element): IED{
	return {
		name: iedElement.getAttribute("name") ?? "unknown"
	}
}