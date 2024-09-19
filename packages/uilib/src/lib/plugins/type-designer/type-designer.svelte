<script lang="ts">
	import { SvelteFlowProvider } from '@xyflow/svelte';
	import Theme from "../../theme/theme.svelte"
    import Canvas from './canvas.svelte';
    import { type DataTypeTemplates, SCDQueries } from '@oscd-plugins/core';
	
	// TODO 20.09
	export let doc: Element // - unavaialble
	export let editCount: number // - unavaialble
	// SCD
	export let root: Element

	$: onDocUpdate(doc)
	$: updateOnEditCount(editCount)

	let htmlRoot: HTMLElement
	let _doc: Element
	let _editCount: number

	let scdQueries = new SCDQueries(root)
	let dataTemplates: DataTypeTemplates

	function onDocUpdate(doc: Element): void {
		console.log("[!] onDocUpdate")
		if (doc === _doc) {
			return
		}
		_doc = doc
		scdQueries = new SCDQueries(root)
		dataTemplates = scdQueries.searchDataTypeTemplates()
	}

	function updateOnEditCount(editCount: number): void {
		if (editCount < 0 || editCount === _editCount) {
			return
		}
		_editCount = editCount
		dataTemplates = scdQueries.searchDataTypeTemplates()
	}

	// TODO z.48 <Canvas dataTemplates={dataTemplates.element} {root} />
</script>


<Theme>
	<SvelteFlowProvider>
		<type-designer bind:this={htmlRoot}>
			<Canvas dataTemplates={undefined} {root} />
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
