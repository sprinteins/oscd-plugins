<script lang="ts">
let {
	name,
	isNew = false
}: {
	name: string
	isNew?: boolean
} = $props()
</script>

<div class="flex flex-wrap gap-2 items-center">
  <span
    class="inline-flex items-center px-3 py-1 rounded-full text-sm font-medium bg-primary text-primary-foreground"
  >
    {name}
    {#if isNew}
      <span class="ml-1 text-xs opacity-75">(new)</span>
    {/if}
  </span>
</div>
