<script lang="ts">
	import { onMount } from "svelte"
	import DocumentationPrintView from "./documentation-print-view/documentation-print-view.svelte"
	import DocumentationWebView from "./documentation-web-view/documentation-web-view.svelte"
	import { disableOpenSCDComponentsForPrintView } from "."
	import { Theme } from "../../theme"

	export let root: Element

	onMount(() => {
		disableOpenSCDComponentsForPrintView()
	})
</script>

<Theme>
	<documentation>
		<DocumentationWebView />
		<DocumentationPrintView bind:scdData={root} />
	</documentation>
</Theme>
