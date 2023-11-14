<script lang="ts">
  import { createEventDispatcher } from "svelte/internal"

  export let checked = false
  export let label: string
  export let value: string | number = ""
  export let testid = ""
</script>

<checkbox data-testid={testid}>
  <label>
    <input type="checkbox" bind:value on:change on:input bind:checked />
    <span class="checkbox">{label}</span>
  </label>
</checkbox>

<style>
  .checkbox {
    overflow: hidden;
    text-overflow: ellipsis;
    white-space: nowrap;
  }
  label {
    display: flex;
    align-items: center;
    gap: 0.5rem;
    accent-color: var(--color-accent);
  }
</style>
