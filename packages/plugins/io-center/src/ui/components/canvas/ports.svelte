<script lang="ts">
    import type {
        Connection,
        NodeElement,
        NodeElementType,
    } from "./types.canvas";

    type Props = {
        side: "right" | "left";
        node: NodeElement;
        number: number;
        startDrawing: (event: MouseEvent, type: NodeElementType) => void;
        stopDrawing: (
            node: string,
            side: string,
            index: number,
            type: NodeElementType,
            addConnection: (connection: Connection) => void,
        ) => void;
        addConnection: (connection: Connection) => void;
    };

    let {
        side,
        node,
        startDrawing,
        number,
        stopDrawing,
        addConnection,
    }: Props = $props();
</script>

<div
    data-title={`${node.name}-${side}`}
    class={`container absolute ${side}-0 top-1/2 transform -translate-y-1/2 ${side === "left" ? "-" : ""}translate-x-1/2`}
>
    {#each Array.from({ length: number }) as _, index}
        <div
            role="button"
            tabindex="-1"
            id={`${side}-circle-${index}`}
            class={`bg-white border border-black w-2 h-2 rounded-full`}
            onmousedown={(event) => {
                startDrawing(event, node.type);
            }}
            onmouseup={() => {
                stopDrawing(node.name, side, index, node.type, addConnection);
            }}
        ></div>
    {/each}
</div>

<style lang="scss">
    .container {
        @apply grid place-items-center gap-1 rounded-full p-1 bg-white border border-gray-300 w-[10%];
    }
</style>
