<script lang="ts">
	import { SvelteFlowProvider } from '@xyflow/svelte';
	import Theme from "../../theme/theme.svelte"

	// 
	// INPUT
	// 
	export let root: Element

	// 
	// INTERNAL
	// 
	let htmlRoot: HTMLElement
</script>

<Theme>
	<SvelteFlowProvider>
	<type-designer bind:this={htmlRoot}>
		<p>Type Designer - Hello</p>
	</type-designer>
	</SvelteFlowProvider>
</Theme>

<style>
	:root, :host {
		--header-height: 128px;
	}
	type-designer {
		height: calc(100vh - var(--header-height));;
		display: flex;
 	 	align-items: stretch;
		position: relative;
		/* font-size: 12px; */
	}
</style>
