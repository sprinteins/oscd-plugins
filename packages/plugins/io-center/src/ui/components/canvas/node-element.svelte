<script lang="ts">
import type { NodeProps } from './types.node'
import { CircleX } from 'lucide-svelte'

let {
	node,
	showLeftCircle,
	showRightCircle,
	startDrawing,
	stopDrawing
}: NodeProps = $props()

function handleClose() {
	return
}
</script>

<!-- svelte-ignore a11y_no_static_element_interactions -->
<div
  data-title={node.name}
  class="relative flex items-center bg-gray-100 border border-gray-300 rounded w-4/5"
>
  {#if showLeftCircle}
    <div
      id="left-circle"
      class="absolute left-0 top-1/2 transform -translate-y-1/2 -translate-x-1/2 w-4 h-4 bg-black rounded-full"
      onmousedown={(event) => {
        startDrawing(event);
      }}
      onmouseup={() => {
        stopDrawing(node.name, "left");
      }}
    ></div>
  {/if}

  <div class="flex-1 text-center">
    <div class="text-gray-700 font-semibold">{node.name}</div>
    <div class="text-sm text-gray-500 mt-1">{node.attribute}</div>
  </div>

  {#if showRightCircle}
    <div
      id="right-circle"
      class="absolute right-0 top-1/2 transform -translate-y-1/2 translate-x-1/2 w-4 h-4 bg-black rounded-full"
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
    <CircleX size=15/>
  </button>
</div>
