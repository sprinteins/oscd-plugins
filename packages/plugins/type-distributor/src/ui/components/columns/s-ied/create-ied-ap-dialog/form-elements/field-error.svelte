<script lang="ts">
const { message }: { message?: string } = $props()
</script>

{#if message}
  <p class="text-sm text-red-600">{message}</p>
{/if}
