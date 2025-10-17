<script lang="ts">
  interface Props {
    onchange?: (event: Event) => void;
    oninput?: (event: Event) => void;
    checked?: boolean;
    label: string;
    testid?: string;
  }

  let {
    onchange,
    oninput,
    checked = $bindable(false),
    label,
    testid = "",
  }: Props = $props();
</script>

<div class="checkbox" data-testid={testid}>
  <label>
    <input type="checkbox" {onchange} {oninput} bind:checked />
    <span class="checkbox">{label}</span>
  </label>
</div>

<style>
  .checkbox {
    overflow: hidden;
    text-overflow: ellipsis;
    white-space: nowrap;
    line-height: 20px; /* Adjusted to better fit prior TS */
  }
  label {
    display: flex;
    align-items: center;
    gap: 0.5rem;
    line-height: 1.15; /* Adjusted to better fit prior TS */
    accent-color: var(--color-accent);
  }
</style>
