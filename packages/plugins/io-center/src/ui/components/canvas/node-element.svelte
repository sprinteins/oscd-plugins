<script lang="ts">
  import { NODE_ELEMENT_TYPE } from "@/headless/constants";
  import EditButton from "../common/edit-button.svelte";
  import type { NodeProps } from "./types.canvas";

  let {
    node,
    showLeftCircle,
    showRightCircle,
    startDrawing,
    stopDrawing,
  }: NodeProps = $props();

  let isSelected = $state(false);

  function handleSelect() {
    isSelected = !isSelected;
  }
</script>

{#if isSelected && node.type === NODE_ELEMENT_TYPE.LC}
  <EditButton />
{:else}
  <!-- placeholder to prevent jumping -->
  <div class="h-8"></div>
{/if}

<button
  data-title={node.name}
  class={{ "node-element": true, selected: isSelected }}
  onclick={handleSelect}
>
  {#if showLeftCircle}
    <div
      role="button"
      tabindex="-1"
      id="left-circle"
      class="absolute left-0 top-1/2 transform -translate-y-1/2 -translate-x-1/2 w-2 h-2 bg-black rounded-full"
      onmousedown={(event) => {
        startDrawing(event);
      }}
      onmouseup={() => {
        stopDrawing(node.name, "left");
      }}
    ></div>
  {/if}

  <div class="flex-1 text-center p-4">
    <div class="text-gray-700 font-semibold">{node.name}</div>
  </div>

  {#if showRightCircle}
    <div
      role="button"
      tabindex="-1"
      id="right-circle"
      class="absolute right-0 top-1/2 transform -translate-y-1/2 translate-x-1/2 w-2 h-2 bg-black rounded-full"
      onmousedown={(event) => {
        startDrawing(event);
      }}
      onmouseup={() => {
        stopDrawing(node.name, "right");
      }}
    ></div>
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
