<script lang="ts">
  import type { WithElementRef } from "bits-ui";
  import { cn } from "$lib/utils/shadcn.js";
  import type { HTMLAttributes } from "svelte/elements";
  let {
    ref = $bindable(null),
    class: className,
    children,
    ...restProps
  }: WithElementRef<HTMLAttributes<HTMLSpanElement>> = $props();
</script>

<span
  bind:this={ref}
  class={cn(
    "text-muted-foreground flex items-center gap-2 text-sm [&_svg]:pointer-events-none [&_svg:not([class*='size-'])]:size-4",
    className
  )}
  {...restProps}
>
  {@render children?.()}
</span>
