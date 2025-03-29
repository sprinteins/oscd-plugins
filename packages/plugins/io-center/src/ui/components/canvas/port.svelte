<script lang="ts">
    import { NODE_ELEMENT_TYPE } from "@/headless/constants";
    import type {
        Connection,
        ConnectionPort,
        NodeElement,
        NodeElementType,
    } from "./types.canvas";

    type Props = {
        node: NodeElement;
        port: ConnectionPort;
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

    const portNumber = port.index || port.index === 0 ? `${port.index}` : "";
</script>

<div
    role="button"
    tabindex="-1"
    id={`${port.side}-circle-${port.name}${portNumber}`}
    class={`relative bg-black border border-black w-2 h-2 rounded-full`}
    onmousedown={(event) => {
        startDrawing(event, port, node.type);
    }}
    onmouseup={() => {
        stopDrawing(
            port,
            node.type === NODE_ELEMENT_TYPE.LP && node.title
                ? node.title
                : node.name,
            node.type,
            addConnection,
        );
    }}
>
    <p class={`absolute ${port.side}-1 -bottom-[125%] px-3`}>
        {`${port.name}${portNumber}`}
    </p>
</div>
