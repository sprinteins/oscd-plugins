<svelte:options
	customElement={{
		props: {
			doc: { reflect: true, type: "Object" },
			docName: { reflect: true, type: "String" },
			editCount: { reflect: true, type: "Number" },
			locale: { reflect: true, type: "String" },
			pluginType: { reflect: true, type: "String" },
			isCustomInstance: { reflect: true, type: "Boolean" },
		},
	}}
/>

<script lang="ts">
	import { onMount } from "svelte";
	import jsonPackage from "../package.json";
	import { initPlugin, initSsdTemplate } from "@oscd-plugins/core-ui-svelte";
	import type { Utils } from "@oscd-plugins/core-api/plugin/v1";
	import Layout from "./ui/layout.svelte";
	import store from "./store.svelte";
	import { buildObjectTree, initQuery } from "./query.svelte";
	import { newCommand, type Command } from "./command.svelte";
	import IEDSelect from "./ied/ied-select.svelte";
	import type { Nullable } from "./types";
	import type { IED } from "./ied/ied";
	import ObjectTree from "./ui/components/object-tree/object-tree.svelte";
	import CanvasArea from "./ui/components/canvas/canvas-area.svelte";
	import LpList from "./ui/components/lp-list/lp-list.svelte";

	// props
	const {
		doc,
		docName,
		editCount,
		// isCustomInstance
	}: Utils.PluginCustomComponentsProps = $props();

	//
	// Setup
	//
	let root = $state<Nullable<HTMLElement>>(null);
	let cmd = $state<Command>(newCommand(store, () => root));

	onMount(() => {
		storeDoc(doc);
		initQuery(store);
	});

	// we need to trigger a rerendering when the editCount changes
	// this is how OpenSCD lets us know that there was a change in the document
	$effect(() => {
		let onlyForEffectTriggering = editCount;
		storeDoc(doc);
	});

	function storeDoc(doc: Nullable<XMLDocument>) {
		console.log("changing doc:", doc);
		store.doc = doc;
	}

	function addIED() {
		cmd.addIED();
	}

	function selectIED(ied: IED) {
		cmd.selectIED(ied);
	}

	function onSelectIED(ied: IED) {
		selectIED(ied);
		buildObjectTree();
	}
</script>

<main
	use:initPlugin={{
		getDoc: () => doc,
		getDocName: () => docName,
		getEditCount: () => editCount,
		getIsCustomInstance: () => isCustomInstance,
		host: $host(),
		theme: "legacy-oscd-instance",
	}}
	data-plugin-name={jsonPackage.name}
	data-plugin-version={jsonPackage.version}
	bind:this={root}
>
	<Layout>
		<div slot="sidebar-left">
			<IEDSelect {onSelectIED} />
			{#if store.objectTree.length > 0}
				<ObjectTree />
			{/if}
		</div>
		<div slot="content">
			<CanvasArea />
		</div>
		<div slot="sidebar-right"><LpList /></div>
	</Layout>
</main>
