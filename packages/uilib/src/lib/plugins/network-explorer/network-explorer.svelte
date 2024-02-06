<script lang="ts">
	import { SvelteFlowProvider } from '@xyflow/svelte';
	import type { Networking } from "@oscd-plugins/core";
	import Theme from "../../theme/theme.svelte"
	import { DiagramContainer } from "./diagram"
	import { DiagramStore } from "./store"
	import { Sidebar } from "./sidebar"
    import type { CreateCableEvent } from "./editor-events/network-events";
	import { EditorEventHandler } from "./editor-events/editor-event-handler"

	// 
	// INPUT
	// 
	export let root: Element

	// 
	// INTERNAL
	// 
	export let store = new DiagramStore()
	let htmlRoot: HTMLElement
	let editEventHandler: EditorEventHandler
	$: editEventHandler = new EditorEventHandler(htmlRoot)

	function onCreateCable(e: CustomEvent<CreateCableEvent>) {
		editEventHandler.dispatchDeleteCable
	}

	function onDelete(event: CustomEvent<Networking[]>): void {
		editEventHandler.dispatchDeleteCable(event.detail)
	}
</script>

<Theme>
	<SvelteFlowProvider>
	<network-explorer bind:this={htmlRoot}>
		{#key root}
			<DiagramContainer {store} doc={root} on:delete={onDelete}/>
		{/key}
		<Sidebar {store} on:createCable={onCreateCable} />
	</network-explorer>
	</SvelteFlowProvider>
</Theme>

<style>
	:root, :host {
		--header-height: 128px;
	}
	network-explorer {
		height: calc(100vh - var(--header-height));;
		display: flex;
 	 	align-items: stretch;
		position: relative;
		/* font-size: 12px; */
	}
</style>
