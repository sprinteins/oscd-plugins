<script lang="ts">
const { messages }: { messages?: string[] } = $props()
</script>

{#if messages?.[0]}
  <p class="text-sm text-red-600">{messages[0]}</p>
{/if}
