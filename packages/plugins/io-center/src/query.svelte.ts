import type { StoreType } from "./store.svelte";

export function initQuery(state: StoreType){
	$effect(() => {
		console.log("doc has changed", state.doc)
	})
}