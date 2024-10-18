<script lang="ts">
	import Theme from "../../theme/theme.svelte"

	import TemplateBuilder from "./template-builder/template-builder.svelte";
	
	export let root: Element

	let htmlRoot: HTMLElement  
</script>

<Theme>
	<auto-doc bind:this={htmlRoot}>
		<main class="container">
			<TemplateBuilder/>
		</main>
	</auto-doc>
</Theme>

<style lang="scss">
	:root, :host {
		--header-height: 128px;
	}
	auto-doc {
		height: calc(100vh - var(--header-height));;
		display: flex;
 	 	align-items: stretch;
		position: relative;
	}

	.container {
		padding: 2em;
		width: 100%;
		justify-items: center;
		overflow-y: auto;
	}
</style>
