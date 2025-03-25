<script lang="ts">
    import { LC_TYPE, NODE_ELEMENT_TYPE } from "@/headless/constants";
    import Port from "./port.svelte";
    import type {
        Connection,
        ConnectionPort,
        NodeElement,
        NodeElementType,
    } from "./types.canvas";

    type Props = {
        side: "right" | "left";
        node: NodeElement;
        ports: ConnectionPort[];
        startDrawing: (
            event: MouseEvent,
            port: ConnectionPort,
            type: NodeElementType,
        ) => void;
        stopDrawing: (
            port: ConnectionPort,
            targetNode: string,
            type: NodeElementType,
            addConnection: (connection: Connection) => void,
        ) => void;
        addConnection: (connection: Connection) => void;
    };

    let { side, node, ports, startDrawing, stopDrawing, addConnection }: Props =
        $props();

    const containerTopPos = ports.length > 2 ? "top-[60%]" : "top-[60%]";
    const containerTranslateX =
        side === "left" ? "-translate-x-1/2" : "translate-x-1/2";
</script>

<div
    data-title={`${node.name}-${side}`}
    class={`container absolute ${side}-0 ${containerTopPos} transform -translate-y-1/2 ${containerTranslateX}`}
>
    {#if node.type === NODE_ELEMENT_TYPE.LC && side === "right" && node.lnClass === LC_TYPE.LCIV && node.numberOfDynamicPorts}
        {#each Array.from({ length: node.numberOfDynamicPorts }, (_, i) => i) as index (index)}
            <Port
                port={{...ports[0], index}}
                {node}
                {startDrawing}
                {stopDrawing}
                {addConnection}
            />
        {/each}
    {:else}
        {#each ports as port}
            <Port {port} {node} {startDrawing} {stopDrawing} {addConnection} />
        {/each}
    {/if}
</div>

<style lang="scss">
    .container {
        @apply grid place-items-center gap-2 rounded-full p-1 bg-white border border-gray-300 w-[10%];
    }
</style>
