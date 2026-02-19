<script lang="ts">
import type { AccessPointData } from '../form-helpers'

let {
	accessPoints,
	onRemove
}: {
	accessPoints: AccessPointData[]
	onRemove: (name: string) => void
} = $props()
</script>

{#if accessPoints.length > 0}
  <div class="flex flex-wrap gap-2">
    {#each accessPoints as ap}
      <span
        class="inline-flex items-center gap-1 px-3 py-1 rounded-full text-sm font-medium border border-primary text-primary"
      >
        {ap.name}
        <button
          type="button"
          class="ml-1 hover:opacity-70 focus:outline-none"
          onclick={() => onRemove(ap.name)}
          aria-label="Remove {ap.name}"
        >
          ×
        </button>
      </span>
    {/each}
  </div>
{/if}
