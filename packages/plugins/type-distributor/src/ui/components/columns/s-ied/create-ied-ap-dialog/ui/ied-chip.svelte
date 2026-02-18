<script lang="ts">
  import type { IedState } from "../lib";

let {
	ied
}: {
	ied: IedState
} = $props()
</script>

<div class="flex flex-wrap gap-2 items-center">
  <span
    class="inline-flex items-center px-3 py-1 rounded-full text-sm font-medium bg-primary text-primary-foreground"
  >
    {ied.name}
    {#if ied.isNew}
      <span class="ml-1 text-xs opacity-75">(new)</span>
    {/if}
  </span>
</div>
