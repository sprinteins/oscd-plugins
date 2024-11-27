<script lang="ts">
    import { TelemetryView } from "../../../communication-explorer/telemetry-view"

    export let scdData: Element
</script>

<div class="telemetry-viewer">
    <TelemetryView bind:root={scdData} showSidebar={false} />
</div>

<style lang="scss">
    .telemetry-viewer {
        :global(div.ied-node-component) {
            border-width: 10px;
        }
    }
</style>
