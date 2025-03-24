<script lang="ts">
  import {
    NODE_ELEMENT_TYPE,
    PORTS_CONFIG_PER_TYPE,
  } from "@/headless/constants";
  import type {
    Connection,
    LcTypes,
    NodeElement as NodeElementType,
    NodeElementType as NodeElementClass,
    ConnectionPort,
  } from "./types.canvas";
  import Ports from "./ports.svelte";
  import { getPortsConfig } from "@/headless/utils";

  type Props = {
    node: NodeElementType;
    leftPortsNumber?: number;
    rightPortsNumber?: number;
    startDrawing: (
      event: MouseEvent,
      port: ConnectionPort,
      type: NodeElementClass,
    ) => void;
    stopDrawing: (
      port: ConnectionPort,
      targetNode: string,
      type: NodeElementClass,
      addConnection: (connection: Connection) => void,
    ) => void;
    addConnection: (connection: Connection) => void;
    editLC?: (lcNode: NodeElementType, newType: LcTypes) => void;
    hasLNodeType?: (type: LcTypes) => boolean;
  };

  let {
    node,
    startDrawing,
    stopDrawing,
    addConnection,
  }: Props = $props();

  let isSelected = $state(false);

  function handleSelect() {
    isSelected = !isSelected;
  }
</script>

<button
  class={{ "node-element": true, selected: isSelected }}
  onclick={handleSelect}
>
  <div class="self-start text-gray-700 font-semibold">{node.name}</div>

  {#if node.type !== NODE_ELEMENT_TYPE.DO}
    <Ports
      side="left"
      {node}
      ports={getPortsConfig(node).filter((port) => port.side === "left")}
      {startDrawing}
      {stopDrawing}
      {addConnection}
    />
  {/if}

  {#if node.type !== NODE_ELEMENT_TYPE.LP}
    <Ports
      side="right"
      {node}
      ports={getPortsConfig(node).filter((port) => port.side === "right")}
      {startDrawing}
      {stopDrawing}
      {addConnection}
    />
  {/if}
</button>

<style lang="scss">
  .node-element {
    @apply relative flex pt-2 px-4 h-20 bg-gray-100 border border-gray-300 rounded w-4/5;
  }

  .selected {
    @apply border-teal-600;
  }
</style>
