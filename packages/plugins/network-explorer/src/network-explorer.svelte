<script lang="ts">
	import { SvelteFlowProvider } from '@xyflow/svelte';
	import type { Networking } from "@oscd-plugins/core";
	import { DiagramContainer } from "./diagram"
	import { DiagramStore } from "./store"
	import { Sidebar } from "./sidebar"
	import type { CreateCableEvent, UpdateCableEvent } from "./editor-events/network-events";
	import { EditorEventHandler } from "./editor-events/editor-event-handler"

type Environment = "NETWORK_EXPLORER" | "AUTO_DOC";

type Props =
  | {
      doc: XMLDocument;
      environment: "AUTO_DOC";
      editCount?: never;
      // biome-ignore lint/suspicious/noExplicitAny: Has been here before, should be investigated properly
      store?: any;
    }
  | {
      doc: XMLDocument;
      environment?: Exclude<Environment, "AUTO_DOC">;
      editCount: number;
			// biome-ignore lint/suspicious/noExplicitAny: Has been here before, should be investigated properly
      store?: any;
    };

	let { doc, editCount, environment = "NETWORK_EXPLORER", store = new DiagramStore() }: Props = $props();
	let htmlRoot: HTMLElement | null = $state(null)
	let editEventHandler: EditorEventHandler = $derived(new EditorEventHandler(htmlRoot!))
	

	function onCreateCable(event: CreateCableEvent) {
		editEventHandler.dispatchCreateCable(event)
		store.resetNewConnection()
	}

	function onUpdateCable(event: UpdateCableEvent) {
		editEventHandler.dispatchUpdateCable(event)
		store.resetNewConnection()
	}

	function onDelete(networkings: Networking[]): void {
		editEventHandler.dispatchDeleteCable(networkings)
	}
</script>

<SvelteFlowProvider>
	<network-explorer bind:this={htmlRoot}>
		<DiagramContainer {store} doc={doc.documentElement} {editCount} onDelete={onDelete}/>
		{#if environment === "NETWORK_EXPLORER"}
			<Sidebar {store} createCable={onCreateCable} updateCable={onUpdateCable} />
		{/if}
	</network-explorer>
</SvelteFlowProvider>

<style>
	:root, :host {
		--header-height: 128px;
		--sidebar-width: 400px;
		--color-paper-white: #ffffff;
		--color-white: #f9f7f1;
		--color-white-dark: #f2f2f2;
		--color-yellow: #d9d800;
		--color-blue: #004552;
		--color-blue-dark: #14343e;
		--color-blue-1: #3253a8;
		--color-blue-1-light: #00c0f9;
		--color-blue-light: #e5ecee;
		--color-torques: #007d80;
		--color-torques-30-opacity: #007d804d;
		--color-green: #288409;
		--color-green-30pc-opacity: #2884094d;
		--color-green-light: #9bff00;
		--color-black: #000000;
		--color-beige-1: burlywood;
		--color-beige-2: blanchedalmond;
		--color-beige-3: #f3ecda;
		--color-beige-4: #fcf6e5;
		--color-beige-5: #fdfbf2;
		--color-red: #b00020;
		--color-pink: #c73c61;
		--color-pink-30-pc-opacity: #c73c614d;
		--color-pink-light: #ff40a7;
		--color-grey-1: #626262;
		--color-grey-2: #808080;
		--color-grey-3: #bdbdbd;
		--color-grey-dark: #4d5d63;
		--color-grey-dark-70pc-opacity: #4d5d63b3;
		--color-cyan: #2aa198;
		--color-cyan-30-pc-opacity: #2aa1984d;
		--color-select-dropdown: #fffff4;
		--color-select-dropdown-transparent: #fffff480;
		--color-accent: var(--color-cyan);

		--font-family: "Roboto", sans-serif;
		--letter-spacing: 0.2px;
		--font-size: 12px;
		--font-size-small: 8px;
		--font-color: var(--color-grey-dark);

		--mdc-theme-primary: var(--color-cyan);
		--mdc-typography-button-font-weight: bold;
		--mdc-theme-surface: var(--color-beige-3);
		--mdc-theme-error: var(--color-red);
	}

	network-explorer {
		height: calc(100vh - var(--header-height));;
		display: flex;
 	 	align-items: stretch;
		position: relative;
	}
</style>
