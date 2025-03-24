<script lang="ts">
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

    const containerTopPos = ports.length > 2 ? "top-[60%]" : "top-[70%]";
    const containerTranslateX =
        side === "left" ? "-translate-x-1/2" : "translate-x-1/2";
</script>

<div
    data-title={`${node.name}-${side}`}
    class={`container absolute ${side}-0 ${containerTopPos} transform -translate-y-1/2 ${containerTranslateX}`}
>
    {#each ports as port, index}
        <Port
            {port}
            {node}
            {startDrawing}
            {stopDrawing}
            {addConnection}
            number={index}
        />
    {/each}
</div>

<style lang="scss">
    .container {
        @apply grid place-items-center gap-2 rounded-full p-1 bg-white border border-gray-300 w-[10%];
    }
</style>
