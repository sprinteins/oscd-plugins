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
	import type {
		LpElement,
		LpTypes,
	} from "./ui/components/lp-list/types.lp-list";
	import type {
    Connection,
		LcTypes,
		NodeElement,
	} from "./ui/components/canvas/types.canvas";

	// props
	const {
		doc,
		docName,
		editCount,
		// isCustomInstance
	}: Utils.PluginCustomComponentsProps = $props();
	const isCustomInstance = true;

	//
	// Setup
	//
	let root = $state<Nullable<HTMLElement>>(null);
	let cmd = $state<Command>(newCommand(() => root));
	useQuery();

	// we need to trigger a rerendering when the editCount changes
	// this is how OpenSCD lets us know that there was a change in the document
	$effect(() => {
		store.editCount = editCount;
		store.doc = doc;
	});

	function addLC(type: LcTypes, number?: number, numberOfLCIVPorts?: number) {
		cmd.addLC(type, number, numberOfLCIVPorts);
	}

	function editLC(lcNode: NodeElement, newType: LcTypes) {
		cmd.editLC(lcNode, newType);
	}

	function addLp(type: LpTypes, name: string, desc: string, number?: number) {
		cmd.addLp(type, name, desc, number);
	}

	function removeLP(lpElement: LpElement) {
		cmd.removeLP(lpElement);
	}

	function editLP(lpElement: LpElement, name: string, desc: string) {
		cmd.editLP(lpElement, name, desc);
	}

	function hasLNodeType(type: LcTypes | LpTypes): boolean {
		return cmd.hasLNodeType(type);
	}

	function addConnection(connection: Connection) {
		cmd.addConnection(connection);
	}
</script>

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
		<CanvasArea slot="content" {addLC} {editLC} {hasLNodeType} {addConnection} />
		<LpList
			slot="sidebar-right"
			{addLp}
			{removeLP}
			{editLP}
			{hasLNodeType}
		/>
	</Layout>
</main>

<style>
</style>
