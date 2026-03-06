<script lang="ts">
const { errors }: { errors?: string[] } = $props()
</script>

{#if errors?.[0]}
  <p class="text-sm text-red-600">{errors[0]}</p>
{/if}
