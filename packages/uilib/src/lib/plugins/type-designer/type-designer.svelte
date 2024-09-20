<script lang="ts">
	import { SvelteFlowProvider } from '@xyflow/svelte';
	import Theme from "../../theme/theme.svelte"
    import Canvas from './canvas.svelte';
    import { type DataTypeTemplatesElement, SCDQueries } from '@oscd-plugins/core';
	
	export let editCount: number
	export let root: Element

	let htmlRoot: HTMLElement
	let _doc: Element
	let _editCount: number
	let scdQueries = new SCDQueries(root)
	let dataTemplates: DataTypeTemplatesElement = scdQueries.searchDataTypeTemplates()

	$: onDocUpdate(root)
	$: updateOnEditCount(editCount)

	function onDocUpdate(doc: Element): void {
		if (doc === _doc) {
			return
		}
		console.log("[!] onDocUpdate")
		_doc = doc
		scdQueries = new SCDQueries(root)
		dataTemplates = scdQueries.searchDataTypeTemplates()
	}

	function updateOnEditCount(editCount: number): void {
		if (editCount < 0 || editCount === _editCount) {
			return
		}
		console.log("[!] onUpdateCount", editCount)
		_editCount = editCount
		dataTemplates = scdQueries.searchDataTypeTemplates()
	}

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
