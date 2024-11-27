<script lang="ts">
import { TelemetryView } from '../../communication-explorer/telemetry-view'
// STORES
import pluginStore from '../stores/plugin'

const { xmlDocument } = pluginStore
</script>

<div class="telemetry-viewer">
	{#if $xmlDocument}
    <TelemetryView root={$xmlDocument.documentElement} showSidebar={false} />
	{/if}
</div>

<style lang="scss">
.telemetry-viewer {
		:global(div.ied-node-component) {
				border-width: 10px;
		}
}
</style>
