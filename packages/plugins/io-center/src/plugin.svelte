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
	import type { Utils } from "@oscd-plugins/core-api/plugin/v1";
	import Layout from "./ui/layout.svelte";
	import store from "./store.svelte";
	import { initQuery } from "./query.svelte";
	import ObjectTreeView from "./ui/components/views/object-tree-view.svelte";

	// CORE
	import { initPlugin, initSsdTemplate } from "@oscd-plugins/core-ui-svelte";

	// props
	const {
		doc,
		docName,
		editCount,
		isCustomInstance,
	}: Utils.PluginCustomComponentsProps = $props();

	initQuery(store);

	onMount(() => {
		store.doc = doc;
	});
	// we need to trigger a rerendering when the editCount changes
	// this is how OpenSCD lets us know that there was a change in the document
	$effect(() => {
		let onlyForEffectTriggering = editCount;
		// biome-ignore lint/correctness/noSelfAssign: We need to trigger a rerendering
		store.doc = store.doc;
	});
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
>
	<ObjectTreeView />
	<div class="flex flex-col space-y-9 items-center justify-center h-screen">
		<h1 class="h1 font-black text-9xl">Hello Plugin!</h1>
		<span
			>See the <i>README</i> file in <b>`packages/template`</b> (oscd-plugins
			monorepo)</span
		>
	</div>
</main>
