<script lang="ts">
	import Theme from "../../theme/theme.svelte"
	
	export let root: Element

	let htmlRoot: HTMLElement
</script>

<Theme>
	<type-designer bind:this={htmlRoot}>
		<p>AutoDoc</p>
	</type-designer>
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
