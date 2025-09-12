<script lang="ts">
	import Theme from "@oscd-plugins/ui/src/components/theme/theme.svelte"
	import { clearSelection } from '../../headless/index.js'
	import TelemetryView from './telemetry-view.svelte'

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
		--sidebar-width: 400px;
	}
</style>