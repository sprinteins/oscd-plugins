<script lang="ts">
let {
	title,
	subtitle,
	showLeftCircle,
	showRightCircle,
	startDragging,
	stopDragging
}: {
	title: string
	subtitle: string
	showLeftCircle: boolean
	showRightCircle: boolean
	startDragging: (event: MouseEvent) => void
	stopDragging: (node: string, side: string) => void
} = $props()
</script>
    
    <!-- svelte-ignore a11y_no_static_element_interactions -->
    <div
      data-title={title}
      class="relative flex items-center bg-gray-100 border border-gray-300 rounded w-4/5"
    >
      {#if showLeftCircle}
        <div
          id="left-circle"
          class="absolute left-0 top-1/2 transform -translate-y-1/2 -translate-x-1/2 w-4 h-4 bg-black rounded-full"
          onmousedown={(event) => {
            startDragging(event);
          }}
          onmouseup={() => {
            // add side
            stopDragging(title, 'left');
          }}
        ></div>
      {/if}
    
      <div class="flex-1 text-center">
        <div class="text-gray-700 font-semibold">{title}</div>
        <div class="text-sm text-gray-500 mt-1">{subtitle}</div>
      </div>
    
      {#if showRightCircle}
        <div
          id="right-circle"
          class="absolute right-0 top-1/2 transform -translate-y-1/2 translate-x-1/2 w-4 h-4 bg-black rounded-full"
          onmousedown={(event) => {
            startDragging(event);
          }}
          onmouseup={() => {
            stopDragging(title, 'right');
          }}
        ></div>
      {/if}
    </div>
    