<script lang="ts">
	import Theme from "../../theme/theme.svelte"

	import TemplateBuilder from "./template-builder/template-builder.svelte";
	
	export let root: Element

	let htmlRoot: HTMLElement

	let title : string
	let description : string
  
</script>

<Theme>
	<auto-doc bind:this={htmlRoot}>
		<main class="container">
			<div class="template-title">
				<input type="text" bind:value={title} placeholder="Name of the template">
				<input type="text" bind:value={description} placeholder="add description of the template">
			</div>
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
		background-color: antiquewhite;
		overflow-y: auto;
	}

	.template-title{
		display: flex;
		flex-direction: column;
		gap: 1rem;
	}
	.template-title{
		margin-bottom: 2rem;
		input{
			font-size: 2rem;
			padding: .7em;
			border: none;

			&:nth-child(even){
				font-size: 1.5rem;
			}
		}
	}

</style>
