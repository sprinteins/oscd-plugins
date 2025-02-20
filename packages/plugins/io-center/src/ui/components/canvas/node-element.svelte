<script lang="ts">
  import type { NodeProps } from "./types.canvas";
  import { X } from "lucide-svelte";

  let {
    node,
    showLeftCircle,
    showRightCircle,
    startDrawing,
    stopDrawing,
  }: NodeProps = $props();

  function handleClose() {
    return;
  }
</script>

<div
  data-title={node.name}
  class="relative flex items-center bg-gray-100 border border-gray-300 rounded w-4/5"
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

  <button
    type="button"
    class="absolute top-0 right-0 cursor-pointer"
    onclick={handleClose}
    aria-label="Close"
  >
    <X size="15" />
  </button>
</div>
