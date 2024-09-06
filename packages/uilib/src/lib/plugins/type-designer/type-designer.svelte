<script lang="ts">
	import { SvelteFlowProvider } from '@xyflow/svelte';
	import Theme from "../../theme/theme.svelte"
    import Canvas from './canvas.svelte';
	
	export let root: Element

	let htmlRoot: HTMLElement
</script>

<Theme>
	<SvelteFlowProvider>
	<div bind:this={htmlRoot}>
		<Canvas root={root} />
	</div>
	</SvelteFlowProvider>
</Theme>

<style>
	:root, :host {
		--header-height: 128px;
	}
</style>
