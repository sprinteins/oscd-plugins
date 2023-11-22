<script lang="ts">
	import Theme from "../../theme/theme.svelte"
	import { DiagramContainer } from "./diagram"
	import { DiagramStore } from "./store"
	import { Sidebar } from "./sidebar"
	import { SvelteFlowProvider } from '@xyflow/svelte';

	// 
	// INPUT
	// 
	export let root: Element

	// 
	// INTERNAL
	// 
	export let controller = new DiagramStore()
</script>

<Theme>
	<SvelteFlowProvider>
	<network-explorer>
		{#key root}
			<DiagramContainer {controller} {root} />
		{/key}
		<Sidebar {controller} />
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
