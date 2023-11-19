<script lang="ts">
	import Theme from "../../theme/theme.svelte"
	import { DiagramContainer } from "./diagram"
	import { DiagramController } from "./controller"
	import { Sidebar } from "./sidebar"

	// 
	// INPUT
	// 
	export let root: Element

	// 
	// INTERNAL
	// 
	export let controller = new DiagramController()
</script>

<Theme>
	<network-explorer>
		{#key root}
			<DiagramContainer {controller} {root} />
		{/key}
		<Sidebar {controller} />
	</network-explorer>
</Theme>

<style>
	network-explorer {
		display: flex;
 	 	align-items: stretch;
		position: relative;
		/* font-size: 12px; */
	}
</style>
