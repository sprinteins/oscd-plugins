<script lang="ts">
  import { NODE_ELEMENT_TYPE } from "@/headless/constants";
  import EditButton from "../common/edit-button.svelte";
  import EditLcDialog from "./edit-lc-dialog.svelte";
  import type { LcTypes, NodeElement as NodeElementType } from "./types.canvas";
  import Ports from "./ports.svelte";
  import { canvasStore } from "./canvas-store.svelte";

  type Props = {
    node: NodeElementType;
    showLeftCircle: boolean;
    showRightCircle: boolean;
    leftPortsNumber?: number;
    rightPortsNumber?: number;
    startDrawing: (event: MouseEvent) => void;
    stopDrawing: (node: string, side: string, index: number) => void;
    editLC?: (lcNode: NodeElementType, newType: LcTypes) => void;
    hasLNodeType?: (type: LcTypes) => boolean;
  };

  let {
    node,
    showLeftCircle,
    showRightCircle,
    leftPortsNumber = 1,
    rightPortsNumber = 1,
    startDrawing,
    stopDrawing,
    editLC,
    hasLNodeType,
  }: Props = $props();

  let isSelected = $state(false);
  let showEditDialog = $state(false);

  function handleSelect() {
    isSelected = !isSelected;
  }
</script>

<!-- Disabled edit button for now, might be enabled later. -->
<!-- {#if isSelected && node.type === NODE_ELEMENT_TYPE.LC && editLC}
  <EditButton onclick={() => (showEditDialog = true)}/>
  <EditLcDialog
    bind:isOpen={showEditDialog}
    bind:nodeSelected={isSelected}
    lcNode={node}
    {editLC}
  />
{:else}
  <div class="h-8"></div>
{/if} -->

<button
  class={{ "node-element": true, selected: isSelected }}
  onclick={handleSelect}
>
  {#if showLeftCircle}
    <Ports
      side="left"
      {node}
      {startDrawing}
      {stopDrawing}
      number={leftPortsNumber}
    />
  {/if}

  <div class="flex-1 text-center p-4">
    <div class="text-gray-700 font-semibold">{node.name}</div>
  </div>

  {#if showRightCircle}
    <Ports
      side="right"
      {node}
      {startDrawing}
      {stopDrawing}
      number={rightPortsNumber}
    />
  {/if}
</button>

<style lang="scss">
  .node-element {
    @apply relative flex items-center bg-gray-100 border border-gray-300 rounded w-4/5;
  }

  .selected {
    @apply border-teal-600;
  }
</style>
