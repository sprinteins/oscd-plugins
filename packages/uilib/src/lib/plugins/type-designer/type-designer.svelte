<script lang="ts">
	import { SvelteFlowProvider } from '@xyflow/svelte';
	import Theme from "../../theme/theme.svelte"
    import Canvas from './canvas.svelte';
	
	export let root: Element

	let htmlRoot: HTMLElement
</script>

<Theme>
	<SvelteFlowProvider>
	<type-designer bind:this={htmlRoot}>
		<Canvas {root} />
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
	}
</style>
