<script lang="ts">
	import Theme from "../../theme/theme.svelte"
	import { clearSelection } from "./_store-view-filter"
	import TelemetryView from "./telemetry-view/telemetry-view.svelte"

	export let root: Element

	$: root && clearSelection()
</script>

<Theme>
	<communication-explorer>
		{#key root}
			<TelemetryView {root} />
		{/key}
	</communication-explorer>
</Theme>

<style>
	communication-explorer {
		display: block;
		position: relative;
		font-size: 12px;
		min-height: 80vh;
	}
</style>
