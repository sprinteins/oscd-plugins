<script lang="ts">
    import type { IEDCommInfo } from "@oscd-plugins/core"
    import PrintTelemetry from "./print-telemetry/print-telemetry.svelte"
    import { calcBusIEDs, calcBayIEDs } from "."
    import PrintDocumentation from "./print-documentation/print-documentation.svelte"

    export let scdData: Element

    let iedByBay: Map<string, IEDCommInfo[]> = calcBayIEDs(scdData)
    let iedByBus: Map<string, IEDCommInfo[]> = calcBusIEDs(scdData)
</script>

<section class="documentation-print-content" id="documentation-print-content">
    <div id="tscd-documentation-print-content-communication">
        <PrintTelemetry bind:scdData />
    </div>

    <div id="tscd-documentation-print-content-documentation">
        <PrintDocumentation {iedByBay} {iedByBus} />
    </div>
</section>

<style lang="scss">
    @media not print {
        .documentation-print-content {
            display: none;
        }
    }
</style>
