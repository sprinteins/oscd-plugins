<script lang="ts">
    import { writable } from "svelte/store";
    import {
        SvelteFlow,
        Controls,
        Background,
        BackgroundVariant,
        MiniMap,
    } from "@xyflow/svelte";

    import "@xyflow/svelte/dist/style.css";

    export let root: Element

    const nodes = writable([
        {
            id: "1",
            type: "input",
            data: { label: "Node 1" },
            position: { x: 0, y: 0 },
        },
        {
            id: "2",
            type: "default",
            data: { label: "Node 2" },
            position: { x: 250, y: 0 },
        },
    ]);

    const edges = writable([
        {
            id: "1-2",
            type: "smoothstep",
            source: "1",
            target: "2",
            sourceHandle: 'right',
            targetHandle: 'left',
            label: "data",
        },
    ]);
</script>

<div style="height: 500px">
    <SvelteFlow
      style="height: 100%"
      {nodes}
      {edges}
      nodesConnectable={false}
      fitView
      minZoom={0.1}
      maxZoom={2.5}
      colorMode="light"
      snapGrid={[20, 20]}
      panOnDrag={true}
      on:nodeclick={(event) => 
        console.log(`${event.detail.node.data.label}: ${event.detail.node.position.x}, ${event.detail.node.position.y}`)}
    >
      <Controls />
      <Background variant={BackgroundVariant.Dots} />
      <MiniMap />
      <p>{JSON.stringify(root)}</p>
    </SvelteFlow>
</div>

