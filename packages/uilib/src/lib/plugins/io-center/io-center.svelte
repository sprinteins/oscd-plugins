<script lang="ts">
	import Theme from "../../theme/theme.svelte"
	
	export let root: Element

	let htmlRoot: HTMLElement
</script>

<Theme>
	<io-center bind:this={htmlRoot}>
		<p>I/O Center</p>
	</io-center>
</Theme>

<style>
	:root, :host {
		--header-height: 128px;
	}
	io-center {
		height: calc(100vh - var(--header-height));;
		display: flex;
 	 	align-items: stretch;
		position: relative;
	}
</style>
