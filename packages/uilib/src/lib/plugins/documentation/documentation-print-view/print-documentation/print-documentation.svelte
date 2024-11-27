<script lang="ts">
    import type { IEDCommInfo } from "@oscd-plugins/core"
    import { PrintBays } from "./print-bays"
    import { PrintBus } from "./print-bus"

    export let iedByBay: Map<string, IEDCommInfo[]>
    export let iedByBus: Map<string, IEDCommInfo[]>
</script>

<PrintBus {iedByBus} />
<PrintBays {iedByBay} />
