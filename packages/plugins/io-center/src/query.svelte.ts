import type { IED } from "./ied/ied";
import type { StoreType } from "./store.svelte";

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
