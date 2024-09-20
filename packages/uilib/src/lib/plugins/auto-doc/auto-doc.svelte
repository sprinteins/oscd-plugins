<script lang="ts">
	import Theme from "../../theme/theme.svelte"
	
	export let root: Element

	let htmlRoot: HTMLElement
</script>

<Theme>
	<auto-doc bind:this={htmlRoot}>
		<p>AutoDoc</p>
	</auto-doc>
</Theme>

<style>
	:root, :host {
		--header-height: 128px;
	}
	auto-doc {
		height: calc(100vh - var(--header-height));;
		display: flex;
 	 	align-items: stretch;
		position: relative;
	}
</style>
