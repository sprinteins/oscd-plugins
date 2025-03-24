<script lang="ts">
    import type {
        Connection,
        ConnectionPort,
        NodeElement,
        NodeElementType,
    } from "./types.canvas";

    type Props = {
        node: NodeElement;
        port: ConnectionPort;
        number: number;
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

    let { node, port, startDrawing, stopDrawing, addConnection }: Props =
        $props();
</script>

<div
    role="button"
    tabindex="-1"
    id={`${port.side}-circle-${port.name}`}
    class={`relative bg-white border border-black w-2 h-2 rounded-full`}
    onmousedown={(event) => {
        startDrawing(event, port, node.type);
    }}
    onmouseup={() => {
        stopDrawing(port, node.name, node.type, addConnection);
    }}
>
    <p class={`absolute ${port.side}-1 -bottom-[125%] px-3`}>{port.name}</p>
</div>
