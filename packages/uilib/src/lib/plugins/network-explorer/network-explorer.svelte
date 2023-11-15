<script lang="ts">
	import Theme from "../../theme/theme.svelte"
	import { DiagramContainer } from "./diagram-container"

	export let root: Element
</script>

<Theme>
	<network-explorer>
		{#key root}
			<DiagramContainer {root} />
		{/key}
	</network-explorer>
</Theme>

<style>
	network-explorer {
		display: block;
		position: relative;
		font-size: 12px;
		/* min-height: 80vh; */
	}
</style>
