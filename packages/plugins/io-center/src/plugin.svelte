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


<main
	use:initPlugin={{
		getDoc: () => doc,
		getDocName: () => docName,
		getEditCount: () => editCount,
		getIsCustomInstance: () => isCustomInstance,
		getHost: () => $host(),
		host: $host(),
		theme: "legacy-oscd-instance",
	}}
	data-plugin-name={jsonPackage.name}
	data-plugin-version={jsonPackage.version}
	bind:this={root}
>
	<Layout>
		<SideBarLeft slot="sidebar-left" />
		<CanvasArea
			slot="content"
			{onAddLC}
		/>
		<LpList slot="sidebar-right" {addLp}/>
	</Layout>
</main>

<style>
	
</style>

<script lang="ts">
	import jsonPackage from "../package.json";
	import { initPlugin } from "@oscd-plugins/core-ui-svelte";
	import type { Utils } from "@oscd-plugins/core-api/plugin/v1";
	import Layout from "./ui/layout.svelte";
	import { useQuery } from "./query.svelte";
	import { newCommand, type Command } from "./command.svelte";
	
	import type { Nullable } from "./types";
	import CanvasArea from "./ui/components/canvas/canvas-area.svelte";
	import LpList from "./ui/components/lp-list/lp-list.svelte";
	import { store } from "./store.svelte";
	import SideBarLeft from "./sidebar-left.svelte";
    import type { LCType } from "./ui/components/canvas/add-lc-dialog/add-lc-dialog.types";

	// props
	const {
		doc,
		docName,
		editCount,
		// isCustomInstance
	}: Utils.PluginCustomComponentsProps = $props();
	const isCustomInstance= true

	$inspect(doc).with((type, doc) => {
		console.log(doc)
	})
	$inspect(editCount)
	//
	// Setup
	//
	let root = $state<Nullable<HTMLElement>>(null);
	let cmd = $state<Command>(newCommand(() => root));	
	useQuery()		

	// we need to trigger a rerendering when the editCount changes
	// this is how OpenSCD lets us know that there was a change in the document
	$effect(() => {
		console.log("edit count changed:", editCount)
		store.editCount = editCount;
		store.doc = doc
	});

	function onAddLC(lcType: LCType, instance: string, nrOfLRTIInputs?: number){
		if(!store.selectedIED){ 
			console.warn("No IED selected")
			return
		}
		cmd.addLC(store.selectedIED.name, lcType, instance)
	}

	function addLp() {
		cmd.addLp();
	}

</script>
