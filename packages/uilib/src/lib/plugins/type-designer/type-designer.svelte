<script lang="ts">
	import { SvelteFlowProvider } from '@xyflow/svelte';
	import Theme from "../../theme/theme.svelte"
    import Canvas from './canvas.svelte';
    import { SCDQueries, UCTypeDesigner } from '@oscd-plugins/core';
	
	export let root: Element

	let htmlRoot: HTMLElement

	const scdQueries = new SCDQueries(root)
	const dataTemplates = scdQueries.searchDataTypeTemplates()
</script>

<Theme>
	<SvelteFlowProvider>
	<type-designer bind:this={htmlRoot}>
		<Canvas dataTemplates={dataTemplates.element} {root} />
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
