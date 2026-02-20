<script lang="ts">
  import type { ComponentProps } from "svelte";
  import { cn } from "$lib/utils/shadcn.js";
  import { Input } from "$lib/ui/shadcn/input/index.js";

  let {
    ref = $bindable(null),
    value = $bindable(),
    class: className,
    ...props
  }: ComponentProps<typeof Input> = $props();
</script>

<Input
  bind:ref
  data-slot="input-group-control"
  class={cn(
    "flex-1 rounded-none border-0 bg-transparent shadow-none dark:bg-transparent",
    className
  )}
  bind:value
  {...props}
/>

<style>
  :global([data-slot="input-group-control"]:focus-visible) {
    outline: none !important;
    box-shadow: none !important;
    --tw-ring-offset-width: 0px !important;
    --tw-ring-offset-shadow: none !important;
    --tw-ring-shadow: none !important;
  }
</style>
